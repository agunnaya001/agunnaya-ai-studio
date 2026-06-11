import { useState, useCallback } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { PreviewPanel } from '@/components/PreviewPanel'
import { FilePlus, ChevronRight, Download, Play, Sparkles, FileCode, X, ChevronDown } from 'lucide-react'

const TEMPLATES: Record<string, { name: string; lang: string; code: string }> = {
  blank: { name: 'Blank.sol', lang: 'sol', code: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract MyContract {\n    // Your code here\n}\n' },
  erc20: {
    name: 'ERC20Token.sol', lang: 'sol',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyToken
/// @notice Standard ERC-20 with minting and ownership
contract MyToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    constructor(address initialOwner)
        ERC20("MyToken", "MTK")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 100_000_000 * 10**18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
`,
  },
  nft: {
    name: 'NFTCollection.sol', lang: 'sol',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFTCollection
/// @notice ERC-721 with URI storage and public minting
contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_SUPPLY = 10000;

    constructor(address initialOwner)
        ERC721("MyNFT", "MNFT")
        Ownable(initialOwner)
    {}

    function mint(string memory tokenURI) external payable returns (uint256) {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_nextTokenId < MAX_SUPPLY, "Sold out");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
`,
  },
  staking: {
    name: 'StakingPool.sol', lang: 'sol',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title StakingPool
/// @notice Stake tokens to earn rewards over time
contract StakingPool is ReentrancyGuard {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;
    uint256 public rewardRate; // tokens per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    constructor(address _stakingToken, address _rewardToken, uint256 _rewardRate) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
    }

    function stake(uint256 amount) external nonReentrant {
        _updateReward(msg.sender);
        balances[msg.sender] += amount;
        totalSupply += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        _updateReward(msg.sender);
        balances[msg.sender] -= amount;
        totalSupply -= amount;
        stakingToken.transfer(msg.sender, amount);
    }

    function claimReward() external nonReentrant {
        _updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
        }
    }

    function _updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + (rewardRate * (block.timestamp - lastUpdateTime) * 1e18) / totalSupply;
    }

    function earned(address account) public view returns (uint256) {
        return (balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + rewards[account];
    }
}
`,
  },
}

type OpenFile = { name: string; lang: string; code: string }

const LANG_MAP: Record<string, string> = { sol: 'sol', ts: 'typescript', tsx: 'typescript', py: 'python', json: 'json', md: 'markdown' }

export default function PlaygroundPage() {
  const { user, loading } = useDashboardUser()
  const [files, setFiles] = useState<OpenFile[]>([TEMPLATES.erc20])
  const [activeIdx, setActiveIdx] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiStreaming, setAiStreaming] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const activeFile = files[activeIdx]

  const loadTemplate = (key: string) => {
    const t = TEMPLATES[key]
    const existing = files.findIndex((f) => f.name === t.name)
    if (existing >= 0) { setActiveIdx(existing) } else { setFiles((prev) => [...prev, { ...t }]); setActiveIdx(files.length) }
    setShowTemplates(false)
  }

  const closeFile = (idx: number) => {
    if (files.length === 1) return
    setFiles((prev) => prev.filter((_, i) => i !== idx))
    setActiveIdx(Math.max(0, idx - 1))
  }

  const updateCode = (code: string | undefined) => {
    if (code === undefined) return
    setFiles((prev) => prev.map((f, i) => i === activeIdx ? { ...f, code } : f))
  }

  const askAI = useCallback(async () => {
    if (!aiInput.trim() || aiStreaming) return
    setAiStreaming(true)
    setAiResponse('')
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const messages = [
        { role: 'user', content: `Here is my Solidity code:\n\`\`\`solidity\n${activeFile.code}\n\`\`\`\n\n${aiInput}` },
      ]
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages, agentId: 'solidity' }),
      })
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setAiResponse(acc)
      }
    } catch (err) {
      setAiResponse('⚠️ ' + (err instanceof Error ? err.message : 'Error'))
    } finally {
      setAiStreaming(false)
    }
  }, [aiInput, aiStreaming, activeFile?.code])

  const download = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = activeFile.name
    a.click()
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>
  if (!user) return null

  return (
    <DashboardLayout user={user} fullHeight>
      <div className="flex h-full flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)} className="text-xs">
              <FileCode size={13} className="mr-1" /> Templates <ChevronDown size={11} className="ml-1" />
            </Button>
            {showTemplates && (
              <div className="absolute left-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg py-1 z-20 min-w-44">
                {Object.entries(TEMPLATES).map(([k, t]) => (
                  <button key={k} onClick={() => loadTemplate(k)} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white">{t.name}</button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={download} className="text-xs"><Download size={13} className="mr-1" /> Export</Button>
          <div className="flex-1" />
          <Button size="sm" onClick={() => setShowAI(!showAI)} className={showAI ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-700 hover:bg-slate-600'}>
            <Sparkles size={13} className="mr-1" /> AI Assist
          </Button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* File tabs + editor */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/40 overflow-x-auto flex-shrink-0">
              {files.map((f, i) => (
                <div key={i} onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs border-r border-slate-800 cursor-pointer flex-shrink-0 ${i === activeIdx ? 'bg-slate-950 text-white border-t border-t-blue-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
                  <FileCode size={11} /> {f.name}
                  {files.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); closeFile(i) }} className="text-slate-600 hover:text-slate-300 ml-1"><X size={10} /></button>
                  )}
                </div>
              ))}
            </div>
            {/* Monaco */}
            <div className="flex-1">
              <MonacoEditor
                key={activeFile?.name}
                height="100%"
                language={LANG_MAP[activeFile?.lang ?? 'sol'] ?? 'sol'}
                theme="vs-dark"
                value={activeFile?.code ?? ''}
                onChange={updateCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                }}
              />
            </div>
            {/* Status bar */}
            <div className="flex items-center gap-4 px-4 py-1 bg-blue-600/80 text-xs text-white flex-shrink-0">
              <span>{activeFile?.name}</span>
              <span className="opacity-70">Solidity 0.8.20</span>
              <div className="flex-1" />
              <span className="opacity-70">UTF-8</span>
            </div>
          </div>

          {/* AI panel */}
          {showAI && (
            <div className="w-80 flex-shrink-0 border-l border-slate-800 bg-slate-900/40 flex flex-col">
              <div className="p-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-white flex items-center gap-2"><Sparkles size={14} className="text-purple-400" /> AI Assistant</p>
                <p className="text-xs text-slate-500 mt-0.5">Ask questions about your code</p>
              </div>
              {aiResponse && (
                <div className="flex-1 p-3 overflow-y-auto">
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                </div>
              )}
              {!aiResponse && (
                <div className="flex-1 p-3 space-y-2">
                  {['Explain this contract', 'Find security issues', 'Add NatSpec comments', 'Optimize gas usage'].map((s) => (
                    <button key={s} onClick={() => setAiInput(s)} className="w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">{s}</button>
                  ))}
                </div>
              )}
              <div className="p-3 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAI()}
                    placeholder="Ask about your code…"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <Button size="sm" onClick={askAI} disabled={aiStreaming} className="bg-purple-600 hover:bg-purple-700 px-3">
                    <Play size={12} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
