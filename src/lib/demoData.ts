import type { ChartResult, ContractResult, JargonResult, QuestionResult } from "./featherlessAI";

const demoChartSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" fill="none">
  <rect width="960" height="540" rx="32" fill="#0F172A"/>
  <rect x="48" y="48" width="864" height="444" rx="24" fill="#111827"/>
  <path d="M96 396H864" stroke="#334155" stroke-width="2"/>
  <path d="M96 318H864" stroke="#243041" stroke-width="2"/>
  <path d="M96 240H864" stroke="#243041" stroke-width="2"/>
  <path d="M96 162H864" stroke="#243041" stroke-width="2"/>
  <path d="M96 84H864" stroke="#243041" stroke-width="2"/>
  <path d="M120 340C165 330 196 300 228 286C260 272 292 292 332 270C372 248 414 162 450 170C486 178 512 264 544 250C576 236 604 186 644 184C684 182 712 220 752 212C792 204 816 132 852 118" stroke="#F97316" stroke-width="6" stroke-linecap="round"/>
  <path d="M120 362C156 354 190 348 220 332C250 316 282 254 322 248C362 242 390 318 426 320C462 322 506 224 550 228C594 232 628 318 670 304C712 290 736 194 774 192C812 190 832 252 852 244" stroke="#22C55E" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <rect x="514" y="108" width="14" height="146" rx="7" fill="#F43F5E"/>
  <rect x="544" y="88" width="14" height="188" rx="7" fill="#F43F5E"/>
  <rect x="574" y="130" width="14" height="132" rx="7" fill="#F43F5E"/>
  <rect x="604" y="152" width="14" height="114" rx="7" fill="#F43F5E"/>
  <rect x="634" y="170" width="14" height="96" rx="7" fill="#F43F5E"/>
  <rect x="664" y="188" width="14" height="84" rx="7" fill="#F43F5E"/>
  <rect x="712" y="108" width="108" height="82" rx="18" fill="#7C3AED" fill-opacity="0.16" stroke="#A78BFA" stroke-width="2"/>
  <text x="732" y="138" fill="#E9D5FF" font-size="24" font-family="Arial, sans-serif" font-weight="700">Layering</text>
  <text x="732" y="170" fill="#C4B5FD" font-size="18" font-family="Arial, sans-serif">Sell wall appears</text>
  <circle cx="766" cy="224" r="9" fill="#F97316"/>
  <circle cx="796" cy="196" r="9" fill="#22C55E"/>
  <text x="96" y="458" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif">09:30</text>
  <text x="248" y="458" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif">10:15</text>
  <text x="408" y="458" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif">11:05</text>
  <text x="576" y="458" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif">13:40</text>
  <text x="744" y="458" fill="#94A3B8" font-size="18" font-family="Arial, sans-serif">14:55</text>
</svg>`;

const enContractResult: ContractResult = {
  riskLevel: "High Risk",
  riskReason: "The effective APR and fee stack strongly suggest predatory lending behavior.",
  transparentReasoning:
    "The contract compresses multiple charges into a calm-looking monthly payment, then recovers margin through rollover fees, punitive default charges, and a unilateral fee-change power.",
  clauseQuote:
    "The lender may revise the service fee schedule at any time and continue accruing charges during any extension period.",
  clauseTranslation:
    "The lender can keep making this loan more expensive after a missed payment, and the debt can snowball fast.",
  redFlags: [
    "Effective APR appears materially higher than the headline rate.",
    "Rollover and extension language creates a debt-trap dynamic.",
    "The lender reserves broad unilateral power to change fees after signing.",
  ],
  checklist: [
    "Confirm the all-in APR, including rollover fees and penalties.",
    "Ask for a plain-language schedule of every fee triggered after a missed payment.",
    "Request a rewritten clause that caps penalties and removes unilateral fee changes.",
  ],
  revisionSuggestions: [
    {
      clauseNumber: "4.2",
      clauseName: "Fee escalation",
      originalText:
        "The lender may revise the service fee schedule at any time and continue accruing charges during any extension period.",
      issue: "Allows one-sided fee changes after signing and compounds debt during rollover periods.",
      suggestedRevision:
        "The lender may not increase fees after execution, and any extension must require separate written consent with a disclosed total cost cap.",
      legalBasis: "Unilateral fee escalation and rollover mechanics undermine meaningful consumer consent.",
    },
    {
      clauseNumber: "5.1",
      clauseName: "Default penalties",
      originalText: "Upon late payment, service fees and collection charges may continue until all balances are cleared.",
      issue: "Open-ended penalties can conceal the real cost of default.",
      suggestedRevision:
        "Default charges must be clearly itemized, capped, and disclosed in total before signing.",
      legalBasis: "Borrowers need stable visibility into post-default exposure before they accept the loan.",
    },
  ],
  agentArena: {
    contractSynopsis:
      "The draft keeps the headline payment calm, but the real economics live in rollover, late-fee compounding, and a unilateral fee-change clause.",
    retrievalSummary:
      "The retrieval layer pulled disclosure rules, unfairness standards, and CFPB enforcement patterns around fee escalation, debt traps, and unlawful collections.",
    lenderStrategySummary:
      "The lender-side agent found three leverage points: hiding the all-in price inside extensions, converting missed payments into an open-ended fee engine, and preserving the right to reprice after signature.",
    publicCounselSummary:
      "The public-interest lawyer agent matched those tactics against disclosure duties, unfairness standards, and enforcement examples that penalized similar payday and high-cost lending structures.",
    arbitrationSummary:
      "The arbitration agent found the contract economically coherent for the lender but procedurally unfair for the borrower. Two clauses should be rewritten immediately and one should be escalated for human review if the lender refuses to cap post-default exposure.",
    predatoryPatternScore: 88,
    lenderPlaybook: [
      {
        clauseRef: "4.2",
        tactic: "Fee ratchet after signature",
        exploitNarrative:
          "Keep headline pricing low, then reserve the right to revise servicing fees once the borrower is locked in and switching costs are high.",
        borrowerImpact:
          "The borrower cannot price the loan ex ante because the lender retains a moving target on total cost.",
        severity: "high",
      },
      {
        clauseRef: "4.2 / 5.1",
        tactic: "Rollover-to-default bridge",
        exploitNarrative:
          "Use extension language to carry balances forward and let new fees accrue into the next missed payment cycle.",
        borrowerImpact:
          "A short-term cash squeeze turns into a compounding debt spiral even if the original principal was manageable.",
        severity: "high",
      },
      {
        clauseRef: "5.1",
        tactic: "Open-ended penalty runway",
        exploitNarrative:
          "Keep default charges uncapped so collections pressure can continue until the lender decides the balance is satisfied.",
        borrowerImpact:
          "The borrower loses any reliable upper bound on the cost of missing a payment.",
        severity: "medium",
      },
    ],
    publicCounselCounters: [
      {
        clauseRef: "4.2",
        challenge: "The borrower never receives a stable all-in price.",
        supportingPrinciple:
          "Consumer credit disclosure rules and unfairness standards both cut against fee structures that materially change total cost after execution without renewed consent.",
        negotiationMove:
          "Freeze all post-signature fees, or require a separate written modification that includes the new total cost and a hard cap.",
        sourceIds: ["tila-reg-z", "cashcall-cfpb"],
        strength: "high",
      },
      {
        clauseRef: "4.2 / 5.1",
        challenge: "Rollover wording creates a debt-trap mechanic.",
        supportingPrinciple:
          "CFPB enforcement has repeatedly targeted payday-style structures that convert short maturities and repeat charges into chronic reborrowing.",
        negotiationMove:
          "Ban automatic extensions and require any hardship plan to stop new service-fee accrual during the cure period.",
        sourceIds: ["ace-cash-express", "udaap-exam"],
        strength: "high",
      },
      {
        clauseRef: "5.1",
        challenge: "Default liability is effectively uncapped.",
        supportingPrinciple:
          "Where post-default fees remain open-ended, borrowers cannot evaluate downside exposure before signing.",
        negotiationMove:
          "Replace ongoing collection charges with a disclosed cap and an itemized schedule attached to the agreement.",
        sourceIds: ["tila-reg-z", "udaap-exam"],
        strength: "medium",
      },
    ],
    arbitrationFindings: [
      {
        clauseRef: "4.2",
        verdict: "rewrite",
        severity: "high",
        finding: "Unilateral fee-escalation authority creates material pricing uncertainty.",
        rationale:
          "This clause undermines meaningful consent because the lender can reshape economics after the borrower commits.",
      },
      {
        clauseRef: "4.2 / 5.1",
        verdict: "escalate",
        severity: "high",
        finding: "The extension and default clauses operate together like a debt-trap engine.",
        rationale:
          "The combined structure can amplify delinquency into repeat-fee harvesting and warrants legal escalation if left uncapped.",
      },
      {
        clauseRef: "5.1",
        verdict: "contest",
        severity: "medium",
        finding: "Default charges must be fully itemized before acceptance.",
        rationale:
          "The clause is salvageable if the lender discloses a total-cost ceiling and removes indefinite accrual language.",
      },
    ],
    evidence: [
      {
        id: "tila-reg-z",
        title: "Truth in Lending Act / Regulation Z",
        citation: "12 C.F.R. Part 1026",
        year: "current",
        jurisdiction: "United States",
        sourceType: "regulation",
        holding:
          "Requires meaningful disclosure of finance charges, APR, and other material credit terms so borrowers can compare costs before committing.",
        relevance:
          "Useful whenever pricing can shift through fees, add-ons, or post-default charges that make headline rates misleading.",
        url: "https://www.consumerfinance.gov/compliance/supervision-examinations/truth-in-lending-act-tila-examination-procedures/",
      },
      {
        id: "udaap-exam",
        title: "CFPB UDAAP Examination Procedures",
        citation: "CFPB Supervision and Examination Manual",
        year: "current",
        jurisdiction: "United States",
        sourceType: "regulation",
        holding:
          "Provides the Bureau's framework for testing whether consumer-finance conduct is unfair, deceptive, or abusive.",
        relevance:
          "Helps explain why a formally legal clause may still be challengeable when it obscures costs or exploits borrower vulnerability.",
        url: "https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps-examination-procedures/",
      },
      {
        id: "cashcall-cfpb",
        title: "CFPB v. CashCall",
        citation: "CFPB enforcement action",
        year: "2013",
        jurisdiction: "United States",
        sourceType: "enforcement",
        holding:
          "CFPB alleged that CashCall serviced and collected on loans that were void or uncollectible under state law and obscured the true lender structure.",
        relevance:
          "A strong analog when a contract uses structure and fee design to evade the borrower's ability to assess lawful total cost.",
        url: "https://www.consumerfinance.gov/about-us/newsroom/cfpb-sues-cashcall-for-illegal-online-loan-servicing/",
      },
      {
        id: "ace-cash-express",
        title: "CFPB action against ACE Cash Express",
        citation: "CFPB enforcement action",
        year: "2014",
        jurisdiction: "United States",
        sourceType: "enforcement",
        holding:
          "CFPB said ACE used illegal debt-collection tactics and pressured borrowers while concealing lower-cost repayment options.",
        relevance:
          "Relevant when default sections increase leverage after delinquency and steer borrowers away from less harmful repayment paths.",
        url: "https://www.consumerfinance.gov/about-us/newsroom/cfpb-takes-action-against-ace-cash-express-for-pushing-payday-borrowers-into-cycle-of-debt/",
      },
    ],
    hallucinationGuards: [
      "The lawyer agent can only cite records returned by the retrieval layer, not invented cases.",
      "The arbitrator cross-checks every counterargument against retrieved evidence IDs before finalizing findings.",
      "Risk labels are normalized after generation so unsupported outputs cannot silently leak to the UI.",
    ],
  },
};

const zhContractResult: ContractResult = {
  ...enContractResult,
  riskLevel: "高风险",
  riskReason: "综合年化成本和费用结构表现出明显的掠夺性借贷特征。",
  transparentReasoning:
    "这份合同把真实成本藏在展期、违约费用和单方调价权里，表面上月供平静，实际上会在借款人陷入压力后快速放大债务。",
  clauseQuote: "贷款方可随时调整服务费标准，并在任何展期期间继续计收相关费用。",
  clauseTranslation: "意思是：只要你开始吃紧，这笔贷款就可能越来越贵，而且贵得没有上限。",
  redFlags: [
    "真实综合成本明显高于表面宣传利率。",
    "展期与续借条款会形成债务滚雪球机制。",
    "贷款方保留了签约后单方面改价的空间。",
  ],
  checklist: [
    "要求对总成本做一次性披露，包含展期费、违约费和催收费。",
    "要求所有逾期后的费用必须有上限并写入合同。",
    "若对方拒绝删除单方调价条款，立即升级人工审查。",
  ],
};

export const getDemoContractResult = (lang: "en" | "zh"): ContractResult =>
  lang === "zh" ? zhContractResult : enContractResult;

export const getDemoContractText = (lang: "en" | "zh") =>
  lang === "zh"
    ? `本借款协议于今日签订。
4.2 费用递增：贷款方可随时调整服务费标准，并在任何展期期间继续计收相关费用。
5.1 违约罚金：一旦发生逾期付款，服务费和催收费可持续累加，直至全部余额结清。`
    : `This Loan Agreement is entered into today.
4.2 Fee escalation: The lender may revise the service fee schedule at any time and continue accruing charges during any extension period.
5.1 Default penalties: Upon late payment, service fees and collection charges may continue until all balances are cleared.`;

export const demoContractResult = getDemoContractResult("en");
export const demoContractText = getDemoContractText("en");

export const getDemoChartImage = () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(demoChartSvg)}`;

export const getDemoChartText = (lang: "en" | "zh") =>
  lang === "zh"
    ? "一张盘中价格与成交量截图：午后突然出现多层大卖单，价格被快速压低，随后挂单迅速撤走并伴随短时间异常放量。请解释趋势，并识别是否存在诱骗盘或分层报价迹象。"
    : "An intraday market screenshot with price, volume, and visible order-book pressure: multiple stacked sell walls appear in the afternoon, the price is pushed down sharply, then those orders disappear as volume spikes. Explain the trend and flag whether spoofing or layering may be present.";

export const getDemoChartResult = (lang: "en" | "zh"): ChartResult => ({
  summary:
    lang === "zh"
      ? "这张图不只是普通下跌走势，更像是先通过密集卖单制造恐慌，再在价格滑落时撤单并完成更有利成交的操纵片段。走势解释和异常交易识别需要一起看。"
      : "This screen looks less like an ordinary bearish session and more like a coordinated pressure event: visible sell-side walls appear, price slips quickly, then those walls fade as execution activity spikes. The trend and the abnormal trading behavior need to be read together.",
  trend: lang === "zh" ? "看跌并伴随异常交易" : "Bearish with abnormal flow",
  riskIndicators:
    lang === "zh"
      ? [
          "午后卖压突然成层堆积，价格对挂单变化异常敏感",
          "放量主要集中在价格被压低的短窗口，而不是全天均匀分布",
          "大额挂单撤离时点与价格反弹时点高度接近",
        ]
      : [
          "Layered sell pressure appears abruptly and price reacts disproportionately to displayed liquidity",
          "Volume concentrates inside the sell-off window instead of distributing evenly across the day",
          "Large displayed orders disappear close to the moment price begins to rebound",
        ],
  historicalContext:
    lang === "zh"
      ? "类似的图形常见于中小盘或流动性不足标的的盘中操纵片段：先堆墙、再压价、最后撤单。单看K线容易误判成普通抛压，结合盘口行为才更接近真实风险。"
      : "Patterns like this often show up in thinner or sentiment-driven names: visible walls appear, price is pushed lower, then the displayed liquidity vanishes. Looking only at the line or candlestick can miss the manipulation risk hidden in the order-book behavior.",
  disclaimer: lang === "zh" ? "用于风控演示，不构成投资建议" : "For risk-review demos only; not investment advice.",
  surveillance: {
    marketManipulationRisk: lang === "zh" ? "高警报：疑似诱骗盘 / 分层报价" : "High Watch: possible spoofing / layering",
    surveillanceSummary:
      lang === "zh"
        ? "视觉风控模块认为，这不是单纯趋势走弱，而是存在通过虚假流动性引导散户预期的嫌疑。"
        : "The surveillance layer treats this as more than a weak trend. It suggests displayed liquidity may have been used to steer retail expectations before quickly withdrawing.",
    abnormalTransactions:
      lang === "zh"
        ? [
            {
              pattern: "分层报价 (Layering)",
              confidence: "high",
              evidence: "卖一到卖五在短时间内同时加厚，形成连续压价墙。",
              marketImpact: "制造继续下跌的错觉，诱导跟风卖出。",
            },
            {
              pattern: "诱骗盘 (Spoofing)",
              confidence: "high",
              evidence: "大额卖单在价格下挫后迅速撤离，没有持续真实成交支持。",
              marketImpact: "用虚假挂单影响价格发现，扭曲市场深度。",
            },
            {
              pattern: "异常成交簇",
              confidence: "medium",
              evidence: "放量集中在恐慌最强的几分钟，而非全天自然扩散。",
              marketImpact: "可能意味着操纵者在情绪被放大时完成更有利成交。",
            },
          ]
        : [
            {
              pattern: "Layering",
              confidence: "high",
              evidence: "Top-of-book sell levels thicken together in a short burst, creating a visible cascading wall.",
              marketImpact: "Creates the impression of relentless downside pressure and can trigger copycat selling.",
            },
            {
              pattern: "Spoofing",
              confidence: "high",
              evidence: "Large displayed sell orders fade quickly after the price drops, without proportional resting execution.",
              marketImpact: "Uses non-bona fide displayed liquidity to distort price discovery and depth perception.",
            },
            {
              pattern: "Abnormal execution cluster",
              confidence: "medium",
              evidence: "Most of the day heavy prints cluster inside the panic window instead of spreading naturally.",
              marketImpact: "Suggests executions may have been timed to monetize the induced move.",
            },
          ],
    forensicClues:
      lang === "zh"
        ? [
            "异常信号 1：盘口墙体先出现，成交放量后快速消失。",
            "异常信号 2：价格反弹并未伴随对称性买盘承接，说明此前卖压可能并不真实。",
            "异常信号 3：图上风险来自显示流动性，不只是长期基本面变化。",
          ]
        : [
            "Forensic clue 1: displayed walls appear before the execution burst and disappear soon after it.",
            "Forensic clue 2: the rebound is not matched by symmetrical buying interest, suggesting the earlier sell wall may not have been genuine.",
            "Forensic clue 3: the risk is driven by displayed-liquidity behavior, not only by long-horizon fundamentals.",
          ],
    recommendedActions:
      lang === "zh"
        ? [
            "导出异常订单簇截图与时间戳，作为监管或导师汇报材料。",
            "将趋势解释与盘口行为分开展示，强调黑箱正在被拆解。",
            "正式版可接入逐笔成交和盘口重建，提升监测严谨度。",
          ]
        : [
            "Export screenshots and timestamps for a regulator or mentor review packet.",
            "Show the trend story separately from the order-book story so the hidden behavior is easy to explain.",
            "In a production build, connect this layer to order-book reconstruction and tick-level surveillance.",
          ],
  },
});

export const getDemoJargonText = (lang: "en" | "zh") =>
  lang === "zh"
    ? "本产品承诺灵活流动性、预期增强收益和结构化保护，还能通过协同优化与摊销机制提升资金效率。"
    : "This product promises enhanced yield, flexible liquidity, structured protection, and synergy-driven repayment efficiency through amortization mechanics.";

export const getDemoJargonResult = (lang: "en" | "zh"): JargonResult => ({
  termsFound: 4,
  terms: [
    {
      term: lang === "zh" ? "摊销 (Amortization)" : "Amortization",
      explanation:
        lang === "zh"
          ? "把贷款拆成一系列固定还款期，逐步归还本金和利息。"
          : "The loan is spread into a sequence of scheduled payments over time.",
      isMarketingSpeak: false,
    },
    {
      term: lang === "zh" ? "增强收益 (Enhanced Yield)" : "Enhanced Yield",
      explanation:
        lang === "zh"
          ? "通常意味着更高收益伴随更高风险，不是免费增益。"
          : "Usually means higher return is being bought with higher risk, not a free upgrade.",
      isMarketingSpeak: true,
    },
    {
      term: lang === "zh" ? "流动性 (Liquidity)" : "Liquidity",
      explanation:
        lang === "zh"
          ? "代表你想把钱拿出来时是否真的拿得出来。"
          : "This tells you how easily you can get your money back when you need it.",
      isMarketingSpeak: false,
    },
    {
      term: lang === "zh" ? "协同效应 (Synergy)" : "Synergy",
      explanation:
        lang === "zh"
          ? "常见营销词，通常听起来高级，但需要追问它到底具体改变了什么。"
          : "A classic marketing phrase that sounds impressive but often hides a lack of concrete detail.",
      isMarketingSpeak: true,
    },
  ],
});

export const getDemoQuestionContext = (lang: "en" | "zh") =>
  lang === "zh"
    ? "贷款专员口头说如果我失业可以暂停还款，但合同文本里完全没有这项承诺，我担心这是诱导签约。"
    : "The loan officer told me verbally that I could pause payments if I lose my job, but that promise does not appear anywhere in the written contract.";

export const getDemoQuestionResult = (lang: "en" | "zh"): QuestionResult => ({
  questions: [
    {
      question:
        lang === "zh"
          ? "如果我失业或收入中断，暂停还款的条件是什么，为什么合同里没有写明？"
          : "If I lose my job or income drops, what exact hardship relief applies and why is it missing from the contract text?",
      whyImportant:
        lang === "zh"
          ? "防止口头承诺在真正发生风险时无法兑现。"
          : "Verbal promises are hard to enforce if they never make it into the signed document.",
    },
    {
      question:
        lang === "zh"
          ? "所有违约后费用、催收费和展期费加总后的上限是多少？"
          : "What is the total cap on all post-default charges, collection fees, and extension fees combined?",
      whyImportant:
        lang === "zh"
          ? "帮助你看清最坏情况下真实要承担的总成本。"
          : "This reveals your real downside exposure instead of the marketing headline.",
    },
    {
      question:
        lang === "zh"
          ? "贷款方是否可以在签约后单方面调整服务费或其他价格条款？"
          : "Can the lender change service fees or other price terms after I sign?",
      whyImportant:
        lang === "zh"
          ? "这是判断合同是否存在单方改价风险的核心问题。"
          : "This is the fastest way to surface hidden repricing power in the agreement.",
    },
  ],
});
