"use strict";

const STORAGE_KEY = "prompt-card-layout-v3";
const PRIMARY_DATA_SOURCE_ZH = "./skills.md";
const PRIMARY_DATA_SOURCE_EN = "./skills-en.md";
const FALLBACK_DATA_SOURCE = "./README.md";
let currentPromptLang = "zh";
let cardBank = {};
let baseCardIds = [];

// ── UI i18n ──
const UI_STRINGS = {
  zh: {
    siteTitle: "卡子",
    cardManagement: "卡子",
    clearUsage: "清空次数",
    switchLang: "切换语言",
    promptZh: "提示词 中",
    promptEn: "EN",
    outputZh: "输出 中",
    outputEn: "EN",
    addCard: "新增卡片",
    metaTemplate: "创建技能",
    needLabel: "需求",
    metaPlaceholder: "例如：把论文 Introduction 压缩成顶会风格 Abstract，300字内。",
    copyInput: "复制输入",
    promptPlaceholder: "粘贴 AI 返回内容：第一行写标题，后续写完整 skills 模板。",
    createCard: "创建卡片",
    cancel: "取消",
    back: "返回",
    editCard: "修改卡片",
    deleteCard: "删除卡片",
    viewTemplate: "查看技能",
    outputLabel: "输出",
    genOutput: "生成输出",
    copyOutput: "复制输出",
    copied: "已复制",
    copyFailed: "复制失败",
    titleLabel: "标题",
    templateContent: "模板内容",
    saveEdit: "保存修改",
    collapseExpand: "折叠/展开所有阶段",
    collapse: "折叠",
    expand: "展开",
    backToTop: "回到顶部",
    addStage: "+ 新增阶段",
    addCardBtn: "+ 卡片",
    deleteStage: "删除",
    restore: "恢复",
    emptyBench: "替补卡片暂无卡片",
    emptyCards: "暂无卡片",
    emptyTrash: "清空回收站",
    pleaseFillInput: "请先在输入区填写内容",
    copiedSuccess: "已复制",
    pleaseFillNeed: "请先填写需求",
    copiedMeta: "已复制",
    copyFailedManual: "复制失败，请手动复制",
    pleasePasteFull: "请粘贴完整内容：第一行标题，后续为 skills 模板",
    load: "加载",
    delete: "删除",
    pleaseEnterName: "请输入名称",
    invalidFormat: "文件格式无效",
    fileParseFailed: "文件解析失败",
    selectLocalFile: "选择本地 skills.md",
    inputPlaceholder: "输入区：把要处理的内容贴在这里...",
    outputPlaceholder: "AI 输出结果...",
    subtitlePlaceholder: "点击添加备注…",
    subtitleInputPlaceholder: "输入备注…",
    uncategorized: "未分类",
    myToolbox: "我的工具箱",
    noticeSkillsFallback: "当前未读取到 {source}，已回退到 README.md。建议把数据迁移到 skills.md。",
    noticeNoSkills: "浏览器没有直接读取到 {source}。你可以点击下面按钮手动选择本地 skills.md 文件。",
    noticeNoTemplates: "没有解析到可用模板，请检查 skills.md 的 Part I 和代码块格式。",
    noticeParseFailed: "解析 skills.md 失败，请确认文件内容完整后重试。",
    loadFromBrowser: "从浏览器加载",
    loadFromFile: "从文件加载",
    deleteStageTooltip: "删除阶段（移入回收站）",
    addCardTooltip: "新增卡片",
    trashWithCount: "回收站 ({count})",
    empty: "清空",
    noCardsInStage: "暂无卡片",
    stage1: "阶段 1：选题与调研",
    stage2: "阶段 2：Idea 构思",
    stage3: "阶段 3：方法设计",
    stage4: "阶段 4：实验执行",
    stage5: "阶段 5：论文写作",
    stage6: "阶段 6：审稿与修改",
    stage7: "阶段 7：投稿与准备",
    nodeApiSystemMsg: "你是一位专业的科研助手。根据用户提供的模板和输入内容，直接输出结果。不要加任何多余解释。",
    titleEmpty: "标题不能为空",
    rename: "改名",
    moveUp: "上移",
    moveDown: "下移",
    uiLangLabel: "界面语言",
    promptLangLabel: "技能",
    outputLangLabel: "输出",
  },
  en: {
    siteTitle: "Cardz",
    cardManagement: "Cardz",
    clearUsage: "Reset Usage",
    switchLang: "Switch Language",
    promptZh: "Prompt ZH",
    promptEn: "EN",
    outputZh: "Output ZH",
    outputEn: "EN",
    addCard: "Add Card",
    metaTemplate: "Create Skill",
    needLabel: "Requirement",
    metaPlaceholder: "e.g.: Compress a paper Introduction into a top-conference style Abstract, within 300 words.",
    copyInput: "Copy Input",
    promptPlaceholder: "Paste AI response: first line is title, rest is the full skills template.",
    createCard: "Create Card",
    cancel: "Cancel",
    back: "Back",
    editCard: "Edit Card",
    deleteCard: "Delete Card",
    viewTemplate: "View Skill",
    outputLabel: "Output",
    genOutput: "Generate",
    copyOutput: "Copy Output",
    copied: "Copied",
    copyFailed: "Failed",
    titleLabel: "Title",
    templateContent: "Template Content",
    saveEdit: "Save Changes",
    collapseExpand: "Collapse/Expand All Stages",
    collapse: "Collapse",
    expand: "Expand",
    backToTop: "Back to Top",
    addStage: "+ Add Stage",
    addCardBtn: "+ Card",
    deleteStage: "Delete",
    restore: "Restore",
    emptyBench: "No cards in bench",
    emptyCards: "No cards",
    emptyTrash: "Empty Trash",
    pleaseFillInput: "Please fill in the input area first",
    copiedSuccess: "Copied",
    pleaseFillNeed: "Please fill in the requirement",
    copiedMeta: "Copied",
    copyFailedManual: "Copy failed, please copy manually",
    pleasePasteFull: "Please paste complete content: first line is title, followed by skills template",
    load: "Load",
    delete: "Delete",
    pleaseEnterName: "Please enter a name",
    invalidFormat: "Invalid file format",
    fileParseFailed: "File parsing failed",
    selectLocalFile: "Select local skills.md",
    inputPlaceholder: "Input: paste content to process here...",
    outputPlaceholder: "AI output...",
    subtitlePlaceholder: "Click to add note...",
    subtitleInputPlaceholder: "Enter note...",
    uncategorized: "Uncategorized",
    myToolbox: "My Toolbox",
    noticeSkillsFallback: "Could not load {source}, fell back to README.md. Consider migrating data to skills.md.",
    noticeNoSkills: "Browser could not load {source}. Click the button below to manually select a local skills.md file.",
    noticeNoTemplates: "No usable templates found. Check skills.md Part I and code block format.",
    noticeParseFailed: "Failed to parse skills.md. Please verify the file content is complete.",
    loadFromBrowser: "Load from Browser",
    loadFromFile: "Load from File",
    deleteStageTooltip: "Delete stage (move to trash)",
    addCardTooltip: "Add card",
    trashWithCount: "Trash ({count})",
    empty: "Empty",
    noCardsInStage: "No cards",
    stage1: "Stage 1: Topic Selection & Research",
    stage2: "Stage 2: Idea Conception",
    stage3: "Stage 3: Method Design",
    stage4: "Stage 4: Experiment Execution",
    stage5: "Stage 5: Paper Writing",
    stage6: "Stage 6: Review & Revision",
    stage7: "Stage 7: Submission & Preparation",
    nodeApiSystemMsg: "You are a professional research assistant. Based on the template and input provided by the user, output the result directly. Do not add any extra explanation.",
    titleEmpty: "Title cannot be empty",
    rename: "Rename",
    moveUp: "Move Up",
    moveDown: "Move Down",
    uiLangLabel: "Interface",
    promptLangLabel: "Skill",
    outputLangLabel: "Output",
  },
};

// Card title translations
const CARD_TITLE_MAP = {
  "Abstract 撰写": "Abstract Writing",
  "Introduction 撰写": "Introduction Writing",
  "Method 章节撰写": "Method Section Writing",
  "Related Work 撰写": "Related Work Writing",
  "Experiments 章节撰写": "Experiments Section Writing",
  "Rebuttal 撰写": "Rebuttal Writing",
  "Workflow 结构分析": "Workflow Structure Analysis",
  "人机协作设计": "Human-AI Collaboration Design",
  "任务定义": "Task Definition",
  "创新点提炼": "Innovation Point Extraction",
  "协作界面评估": "Collaboration Interface Evaluation",
  "反向假设验证": "Reverse Hypothesis Verification",
  "可行性评估": "Feasibility Assessment",
  "多阶段系统设计": "Multi-Stage System Design",
  "失败场景设计": "Failure Scenario Design",
  "失败案例分析": "Failure Case Analysis",
  "实验方案设计": "Experiment Plan Design",
  "实验结果分析": "Experiment Results Analysis",
  "实验记录与复盘": "Experiment Log & Review",
  "对比学习设计": "Contrastive Learning Design",
  "压力测试 Benchmark 构建": "Stress Test Benchmark Construction",
  "损失函数与优化策略": "Loss Function & Optimization Strategy",
  "数据构造 Pipeline": "Data Construction Pipeline",
  "数据质量评估": "Data Quality Assessment",
  "文献检索策略": "Literature Search Strategy",
  "方法架构设计": "Method Architecture Design",
  "方法迁移评估": "Method Transfer Assessment",
  "实验日志记录": "Experiment Log Record",
  "论文段落润色": "Paper Paragraph Polishing",
  "概念图设计指引": "Conceptual Figure Design Guide",
  "消融实验设计": "Ablation Experiment Design",
  "现有 Benchmark 分析": "Existing Benchmark Analysis",
  "批判性分析撰写": "Critical Analysis Writing",
  "研究领域图谱梳理": "Research Landscape Mapping",
  "研究 Idea 头脑风暴": "Research Idea Brainstorming",
  "论文一致性审查": "Paper Consistency Review",
  "论文压缩与页数控制": "Paper Compression & Page Control",
  "论文精读笔记": "Paper Deep Reading Notes",
  "评估协议设计": "Evaluation Protocol Design",
  "计算成本分析": "Computational Cost Analysis",
  "逐段语言审查": "Paragraph-Level Language Review",
  "领域图谱梳理": "Research Landscape Mapping",
  "投稿 Checklist 核对": "Submission Checklist Review",
};

function translateCardTitle(title) {
  if (uiLang === "en") {
    return CARD_TITLE_MAP[title] || title;
  }
  // If zh, reverse lookup
  for (const [zh, en] of Object.entries(CARD_TITLE_MAP)) {
    if (en === title) return zh;
  }
  return title;
}

let uiLang = localStorage.getItem("ui-lang") || "zh";
let outputLangGlobal = "zh";
function t(key) {
  return (UI_STRINGS[uiLang] && UI_STRINGS[uiLang][key]) || key;
}
function getOutputLang() {
  return outputLangGlobal;
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-tooltip]").forEach((el) => {
    el.dataset.tooltip = t(el.dataset.i18nTooltip);
  });
  document.title = t("siteTitle");
}

const PART_ONE_HEADING = /^#\s+Part I:\s*.*$/;
const PART_TWO_HEADING = /^#\s+Part II:/;
const DEFAULT_COMMON_TITLES = [];
const META_TEMPLATE_TEXT_ZH = `# Role
你是一位世界顶级的 AI 提示词工程师（Prompt Engineer）。你的任务是根据我的【核心需求】，为我量身定制一套高标准、结构化的提示词模板，以便我能够用它来指导其他 AI 完美执行任务。

# Task
请分析我的需求，并严格按照下方的【目标模板结构】生成一份高质量的提示词。

# Target Template Structure (目标模板结构)
你输出的提示词必须包含以下四个部分，并且排版清晰：
1. # Role (角色设定)：为执行该任务的 AI 赋予一个最匹配、最资深的专家身份（例如：资深学术翻译官、顶级期刊编辑、高级数据分析师等）。
2. # Task (核心任务)：用一两句话清晰、无歧义地概括 AI 需要完成的动作。
3. # Constraints (约束与规则)：这是最核心的部分。请根据我的需求，帮我穷举并细化 AI 在执行任务时必须遵守的规则。可以包括但不限于：
   - 工作流（第一步做什么，第二步做什么）
   - 质量标准（语气风格、专业度要求）
   - 避坑指南（明确指出"不要做什么"，比如不要擅自增加信息、不要使用特定词汇等）
   - 输出格式（JSON、Markdown、纯文本、表格等）
4. # Input (输入区)：在末尾留出用括号包裹的占位符，例如 [在此处粘贴你的文本/数据/代码]，方便我后续填入真实内容。

# Constraints for You (对你的约束)
1. 专业度：生成的约束条件（Constraints）必须直击痛点。比如如果是学术写作任务，你要自动帮我加上"学术客观语气"、"避免使用过度口语化的副词"等专业规则。
2. 零废话：只输出生成好的提示词模板本身，不要加任何诸如"好的，我为您生成"之类的寒暄废话。
3. 语言：输出的提示词模板使用中文。
4. 输出格式（严格按以下顺序，不要打乱）：
   - 第一行：标题（仅标题，不加解释）。以动词开头，简短有力，严格控制在 4-5 个字以内，例如"写作摘要"、"汇总文献"。
   - 第二行：hint: xxx。用一句话告诉用户应该在这个卡片里粘贴什么内容，例如"粘贴论文的 Introduction 段落"。这行必须以 "hint:" 开头。
   - 第三行开始：完整 skills 模板正文（包含 Role、Task、Constraints、Input 四个部分）。

# Input (我的核心需求)
[在这里填写你的具体需求，例如：我想把一篇论文的 Introduction 喂给 AI，让它帮我写出一篇不超过300字的 Abstract，要有逻辑感，符合计算机顶会的风格。]`;

const META_TEMPLATE_TEXT_EN = `# Role
You are a world-class AI Prompt Engineer. Your task is to create a high-standard, structured prompt template based on my [Core Requirement], so I can use it to guide other AI to perfectly execute tasks.

# Task
Analyze my requirement and generate a high-quality prompt strictly following the [Target Template Structure] below.

# Target Template Structure
Your output prompt must include the following four parts, formatted clearly:
1. # Role: Assign the most matching, senior expert identity to the AI executing this task (e.g., Senior Academic Translator, Top Journal Editor, Senior Data Analyst, etc.).
2. # Task: Clearly and unambiguously summarize the action AI needs to complete in one or two sentences.
3. # Constraints: This is the core part. Based on my requirement, exhaustively list and detail the rules AI must follow when executing the task. Include but not limited to:
   - Workflow (what to do first, what to do second)
   - Quality standards (tone, style, professionalism requirements)
   - Pitfall avoidance guide (clearly specify "what not to do", e.g., don't add information, don't use specific words, etc.)
   - Output format (JSON, Markdown, plain text, table, etc.)
4. # Input: Leave placeholders wrapped in brackets at the end, e.g., [Paste your text/data/code here], for me to fill in real content later.

# Constraints for You
1. Professionalism: Generated constraints must hit the pain point. For example, for academic writing tasks, automatically add professional rules like "academic objective tone", "avoid overly colloquial adverbs".
2. No fluff: Only output the generated prompt template itself, no chit-chat like "Sure, here's what I generated".
3. Language: Output the prompt template in English.
4. Output format (strictly follow this order):
   - First line: title (title only, no explanation). Start with a verb, keep it short and punchy, within 4-8 words, e.g., "Write Abstract", "Summarize Papers".
   - Second line: hint: xxx. One sentence telling the user what to paste into this card, e.g., "Paste your paper's Introduction paragraph". This line MUST start with "hint:".
   - From the third line onwards: complete skills template body (including Role, Task, Constraints, Input).

# Input (My Core Requirement)
[Fill in your specific requirement here, e.g., I want to feed a paper's Introduction to AI and have it write an Abstract of no more than 300 words, with logical flow, in the style of top CS conferences.]`;

function getMetaTemplateText() {
  if (currentPromptLang === "en") {
    return META_TEMPLATE_TEXT_EN;
  }
  return META_TEMPLATE_TEXT_ZH;
}

const META_INPUT_PLACEHOLDER_ZH =
  "[在这里填写你的具体需求，例如：我想把一篇论文的 Introduction 喂给 AI，让它帮我写出一篇不超过300字的 Abstract，要有逻辑感，符合计算机顶会的风格。]";
const META_INPUT_PLACEHOLDER_EN =
  "[Fill in your specific requirement here, e.g., I want to feed a paper's Introduction to AI and have it write an Abstract of no more than 300 words, with logical flow, in the style of top CS conferences.]";

function getMetaInputPlaceholder() {
  if (currentPromptLang === "en") {
    return META_INPUT_PLACEHOLDER_EN;
  }
  return META_INPUT_PLACEHOLDER_ZH;
}

const commonRoot = document.getElementById("commonRoot");
const stagesRoot = document.getElementById("stagesRoot");
const customStagesRoot = document.getElementById("customStagesRoot");
const addStageBtn = document.getElementById("addStageBtn");
const cardCount = document.getElementById("cardCount");
const cardTemplate = document.getElementById("cardTemplate");
const resetUsageBtn = document.getElementById("resetUsageBtn");

const layout1El = document.getElementById("layout1");

const DEFAULT_USER_CARDS = [
  {
    title: "方法迁移评估",
    category: "用户卡片",
    hint: "粘贴源论文的方法描述（核心机制、关键公式、实验设置）和你的研究问题/目标场景",
    prompt: `# Role
你是一位经验丰富的跨领域研究顾问，擅长评估一个方法从源领域迁移到目标领域的可行性和适配方案。

# Task
根据我提供的【源论文方法描述】和【我的研究问题/目标领域】，评估该方法迁移到我的场景中的可行性，分析需要做哪些适配，并给出具体的迁移建议。

# Constraints
1. 核心假设分析：
   - 源方法的核心假设是什么？（如数据分布、任务结构、评估方式等）
   - 这些假设在我的目标场景中是否成立？
   - 哪些假设可能不成立？不成立的话会带来什么问题？
2. 迁移可行性评估：
   - 技术层面：方法的哪些组件可以直接复用？哪些需要修改？哪些完全不适用？
   - 数据层面：源方法需要的数据条件和我的数据条件有什么差异？
   - 评估层面：源方法的评估指标在我的场景下是否合理？需要替换或补充什么指标？
3. 适配方案：
   - 给出具体的适配步骤（第一步做什么、第二步做什么）。
   - 每个步骤的技术选择和理由。
   - 可能需要引入的额外组件或技术。
4. 风险预警：
   - 迁移过程中最大的 2-3 个风险点。
   - 每个风险的应对策略。
   - 什么情况下应该放弃这个迁移方向？
5. 输出格式：
   - Part 1 [可行性评估]：假设分析 + 技术/数据/评估层面的可行性。
   - Part 2 [适配方案]：具体的迁移步骤和技术选择。
   - Part 3 [风险与建议]：风险预警 + 最终建议（推荐/谨慎/不推荐）。
   - 除以上三部分外，不要输出多余的对话。

# Input
[在此处粘贴源论文的方法描述（核心机制、关键公式、实验设置），以及你的研究问题和目标场景的简要描述]`,
  },
  {
    title: "实验日志记录",
    category: "用户卡片",
    hint: "粘贴本次实验的配置、结果数据，以及你想验证的目标",
    prompt: `# Role
你是一位严谨的科研实验记录助手，擅长帮助研究者结构化地记录实验过程、结果和反思，确保实验可复现、思路可追溯。

# Task
根据我提供的【实验信息】，帮我生成一份结构化的实验日志条目，用于记录本次实验的完整信息。

# Constraints
1. 日志结构：
   - 实验编号与日期：自动编号，标注日期。
   - 实验目标：本次实验想验证什么？对应论文的哪个 claim？
   - 实验配置：模型配置、超参数、数据集版本、随机种子等所有可复现信息。
   - 实验结果：核心指标的具体数值，与上次实验的对比。
   - 观察与分析：结果是否符合预期？如果不符合，可能的原因是什么？
   - 下一步计划：基于本次结果，下一步要做什么？
2. 记录规范：
   - 所有数值必须具体，不要说"效果不错"，要说"准确率从 82.3% 提升到 85.1%"。
   - 超参数必须完整记录，不要遗漏任何可能影响复现的设置。
   - 如果有异常结果，必须详细记录当时的条件和可能的干扰因素。
3. 对比分析：
   - 如果我提供了历史实验数据，自动与最近的实验进行对比。
   - 标注哪些指标有提升，哪些有下降，变化幅度是多少。
4. 输出格式：
   - Part 1 [实验日志]：按上述结构输出完整日志。
   - Part 2 [关键发现]：用 1-2 句话总结本次实验最重要的发现。
   - Part 3 [下一步行动]：具体的下一步实验计划。
   - 除以上三部分外，不要输出多余的对话。

# Input
[在此处粘贴本次实验的配置、结果数据，以及你想验证的目标]`,
  },
  {
    title: "论文段落润色",
    category: "用户卡片",
    hint: "粘贴你需要润色的英文论文段落",
    prompt: `# Role
你是一位以语言精准著称的学术论文编辑，专门为非母语英语作者提供论文润色服务，对计算机科学领域的学术写作惯例有深入理解。

# Task
对我提供的【论文段落】进行润色，在保持原意和作者风格的前提下，提升语言的精准度和专业度。

# Constraints
1. 润色原则：
   - 最小修改：只改确实有问题的地方，不要对已经通顺的句子进行"美化式重写"。
   - 保留原意：绝不改变作者要表达的意思，哪怕原句写得不够好。
   - 保留风格：不要改变作者的叙述节奏和个人风格。
   - 学术语体：使用正式学术英语，避免口语化表达。
2. 修改类型：
   - 语法修正：主谓一致、时态、冠词、介词等基础语法问题。
   - 用词优化：替换不准确或不地道的用词，使用更学术的表达。
   - 句式调整：改善句子结构，使逻辑更清晰、表达更紧凑。
   - 连接词优化：改善段落内部和段落之间的逻辑衔接。
3. 禁止事项：
   - 不要添加原段落中没有的信息。
   - 不要删除原段落中的关键信息。
   - 不要为了"听起来更高级"而替换词汇，只有在原词确实不准确时才替换。
   - 不要改变段落的论证逻辑。
4. 输出格式：
   - Part 1 [润色后英文]：润色后的完整段落。
   - Part 2 [修改清单]：逐条列出修改内容，格式为"原文 → 修改后 → 修改理由"。
   - Part 3 [中文对照]：润色后段落的中文直译，用于核对原意是否保留。
   - 除以上三部分外，不要输出多余的对话。

# Input
[在此处粘贴你需要润色的英文论文段落]`,
  },
];
const addModal = document.getElementById("addModal");
const addModalMask = document.getElementById("addModalMask");
const metaTemplateInput = document.getElementById("metaTemplateInput");
const metaNeedInput = document.getElementById("metaNeedInput");
const copyMetaBtn = document.getElementById("copyMetaBtn");
const metaStatusText = document.getElementById("metaStatusText");
const addPromptInput = document.getElementById("addPromptInput");
const createCardBtn = document.getElementById("createCardBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const addStatusText = document.getElementById("addStatusText");
const notice = document.getElementById("notice");
const noticeText = document.getElementById("noticeText");
const manualFile = document.getElementById("manualFile");
const manualLoadBtn = document.querySelector(".manual-load-btn");

let allItems = [];
let draggingId = null;
const inputStore = new Map();
let state = createDefaultState();
let pendingStageId = "";
let layout1Rendered = false;

init();
bindAddCardPanel();
bindLangControls();
bindFloatingActions();

function bindFloatingActions() {
  const toggleBtn = document.getElementById("toggleCollapseBtn");
  const topBtn = document.getElementById("scrollTopBtn");

  if (toggleBtn) {
    let collapsed = false;
    toggleBtn.addEventListener("click", () => {
      collapsed = !collapsed;
      toggleBtn.textContent = collapsed ? t("expand") : t("collapse");
      document.querySelectorAll(".layout1 details.zone").forEach((det) => {
        det.open = !collapsed;
      });
    });
  }

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function updateUiLang(newLang) {
  uiLang = newLang;
  localStorage.setItem("ui-lang", uiLang);
  applyStaticI18n();

  const uiLangText = document.getElementById("uiLangText");
  if (uiLangText) uiLangText.textContent = uiLang === "zh" ? "中" : "EN";

  const skillLangWrap = document.getElementById("skillLangWrap");

  if (uiLang === "en") {
    if (skillLangWrap) skillLangWrap.classList.add("hidden");
    updateSkillLang("en");
  } else {
    if (skillLangWrap) skillLangWrap.classList.remove("hidden");
    const savedSkillLang = localStorage.getItem("skill-lang") || "zh";
    updateSkillLang(savedSkillLang);
  }

  if (layout1El && !layout1El.classList.contains("hidden")) {
    layout1Rendered = false;
    render();
  }
}

function updateSkillLang(newLang) {
  currentPromptLang = newLang;
  localStorage.setItem("prompt-lang", currentPromptLang);
  localStorage.setItem("skill-lang", currentPromptLang);

  document.querySelectorAll("#skillLangWrap .segment-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === currentPromptLang);
  });

  refreshAllItems();
  render();
}

async function init() {
  const savedPromptLang = localStorage.getItem("prompt-lang");
  if (savedPromptLang === "en" || savedPromptLang === "zh") {
    currentPromptLang = savedPromptLang;
  }

  const [zhMarkdown, enMarkdown] = await Promise.all([
    fetchSkills(PRIMARY_DATA_SOURCE_ZH),
    fetchSkills(PRIMARY_DATA_SOURCE_EN),
  ]);

  const zhItems = zhMarkdown ? parsePromptItems(zhMarkdown) : [];
  const enItems = enMarkdown ? parsePromptItems(enMarkdown) : [];

  if (zhItems.length > 0 || enItems.length > 0) {
    buildCardBank(zhItems, enItems);
    hideNotice();
  } else {
    showNotice(t("noticeNoSkills").replace("{source}", PRIMARY_DATA_SOURCE_ZH));
    manualLoadBtn.classList.remove("hidden");
  }

  state = normalizeState(loadState());
  try { seedDefaultUserCards(); } catch (e) { console.error("seed error:", e); }
  refreshAllItems();
  saveState();

  if (allItems.length === 0) {
    showNotice(t("noticeNoTemplates"));
    manualLoadBtn.classList.remove("hidden");
  }

  switchToLayout1();
}

async function fetchSkills(source) {
  try {
    const response = await fetch(source + "?t=" + Date.now(), { cache: "no-store" });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    return null;
  }
}

function buildCardBank(zhItems, enItems) {
  cardBank = {};
  baseCardIds = [];

  let stageNum = 0;
  let cardInStage = 0;
  let prevCategory = null;

  zhItems.forEach((zhItem, i) => {
    if (zhItem.category !== prevCategory) {
      stageNum++;
      cardInStage = 1;
      prevCategory = zhItem.category;
    } else {
      cardInStage++;
    }

    const id = `${stageNum}-${cardInStage}`;
    baseCardIds.push(id);
    cardBank[id] = {
      zh: zhItem,
      en: enItems[i] || null,
    };
  });
}

function getCardFromBank(id) {
  const entry = cardBank[id];
  if (!entry) return null;
  const skillData = entry[currentPromptLang] || entry.zh || entry.en;
  const uiData = entry[uiLang] || entry.zh || entry.en;
  if (!skillData) return null;

  const patch = state.editedCards[id];
  return {
    id,
    stageNum: String(id).split("-")[0],
    title: patch && typeof patch.title === "string" ? patch.title : skillData.title,
    category: skillData.category || t("uncategorized"),
    prompt: patch && typeof patch.prompt === "string" ? patch.prompt : skillData.prompt,
    hint: uiData.hint || "",
    source: "base",
  };
}

manualFile.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const text = await file.text();
  const items = parsePromptItems(text);
  if (items.length > 0) {
    buildCardBank(items, []);
    state = normalizeState(loadState());
    seedDefaultUserCards();
    refreshAllItems();
    saveState();
    layout1Rendered = false;
    render();
  }
});

if (resetUsageBtn) {
  resetUsageBtn.addEventListener("click", () => {
    resetAllUsageCount();
  });
}

function parsePromptItems(markdown) {
  const partOne = extractPartOne(markdown);
  const sections = splitSections(partOne);

  return sections
    .map((section) => {
      const prompt = extractFenceBlocks(section.content).join("\n\n").trim();
      const hint = extractHint(section.content);
      return {
        id: section.id,
        title: section.title,
        category: section.category || "未分类",
        prompt,
        hint,
      };
    })
    .filter((item) => item.prompt.length > 0);
}

function extractHint(lines) {
  for (const line of lines) {
    const match = line.match(/^hint:\s*(.+)$/);
    if (match) return match[1].trim();
  }
  return "";
}

function extractPartOne(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inPartOne = false;
  const buffer = [];

  for (const line of lines) {
    if (!inPartOne) {
      if (PART_ONE_HEADING.test(line)) {
        inPartOne = true;
        buffer.push(line);
      }
      continue;
    }

    if (PART_TWO_HEADING.test(line)) {
      break;
    }
    buffer.push(line);
  }

  if (!inPartOne) {
    return markdown;
  }

  return buffer.join("\n");
}

function splitSections(partOneText) {
  const lines = partOneText.split(/\r?\n/);
  const sections = [];
  let current = null;
  let currentCategory = "未分类";
  let inFence = false;
  let fenceMarker = "";
  const usedIds = new Set();

  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker.length >= fenceMarker.length) {
        inFence = false;
        fenceMarker = "";
      }
      if (current) {
        current.content.push(line);
      }
      continue;
    }

    if (!inFence) {
      const categoryHeading = line.match(/^##\s+(.+?)\s*$/);
      if (categoryHeading) {
        currentCategory = cleanTitle(categoryHeading[1]) || "未分类";
        continue;
      }

      const heading = line.match(/^###\s+(.+?)\s*$/);
      if (heading) {
        if (current) {
          sections.push(current);
        }
        const title = cleanTitle(heading[1]);
        current = {
          id: buildStableId(title, usedIds),
          title,
          category: currentCategory,
          content: [],
        };
        continue;
      }
    }

    if (current) {
      current.content.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

function extractFenceBlocks(lines) {
  const blocks = [];
  let inFence = false;
  let fenceMarker = "";
  let buffer = [];

  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
        buffer = [];
      } else if (marker.length >= fenceMarker.length) {
        inFence = false;
        const block = buffer.join("\n").trim();
        if (block) {
          blocks.push(block);
        }
        fenceMarker = "";
        buffer = [];
      }
      continue;
    }

    if (inFence) {
      buffer.push(line);
    }
  }

  return blocks;
}

function cleanTitle(title) {
  return title
    .replace(/[💡🎯✨📖📑🤖📝🎉🔬🚀🤝]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildStableId(title, usedIds) {
  const base =
    title
      .toLowerCase()
      .replace(/[()（）]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\u4e00-\u9fa5_-]/g, "") || "card";

  if (!usedIds.has(base)) {
    usedIds.add(base);
    return base;
  }

  let index = 2;
  while (usedIds.has(`${base}-${index}`)) {
    index += 1;
  }
  const id = `${base}-${index}`;
  usedIds.add(id);
  return id;
}


function render(options = {}) {
  const suppressAnimation = Boolean(options.suppressAnimation);
  if (suppressAnimation) {
    document.body.classList.add("no-enter-anim");
  }

  renderStages(allItems);
  renderCustomStages();

  if (suppressAnimation) {
    requestAnimationFrame(() => {
      document.body.classList.remove("no-enter-anim");
    });
  }
}

function renderStages(stageItems) {
  stagesRoot.innerHTML = "";
  const grouped = new Map();

  stageItems.forEach((item) => {
    const stageNum = item.stageNum || "0";
    if (stageNum === "0") return;
    if (!grouped.has(stageNum)) {
      grouped.set(stageNum, []);
    }
    grouped.get(stageNum).push(item);
  });

  for (let stageNum = 1; stageNum <= 7; stageNum++) {
    const items = grouped.get(String(stageNum));
    if (!items || items.length === 0) continue;

    const details = document.createElement("details");
    details.className = "zone stage-zone";
    details.open = true;

    const summary = document.createElement("summary");
    const span = document.createElement("span");
    span.textContent = t("stage" + stageNum);

    const addBtn = document.createElement("button");
    addBtn.className = "stage-ctrl-btn";
    addBtn.textContent = "+ " + t("addCardBtn").replace("+ ", "");
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      pendingStageId = "builtin:" + stageNum;
      addModal.classList.remove("hidden");
      metaNeedInput.focus();
    });

    summary.append(span, addBtn);
    details.appendChild(summary);

    const section = document.createElement("section");
    section.className = "cards";
    section.setAttribute("aria-label", t("stage" + stageNum) + " 卡片列表");
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      const card = createCard(item, "pool", index);
      fragment.appendChild(card);
    });
    section.appendChild(fragment);
    details.appendChild(section);

    stagesRoot.appendChild(details);
  }
}

function renderCustomStages() {
  if (!customStagesRoot) return;
  customStagesRoot.innerHTML = "";
  const sorted = [...state.customStages].sort((a, b) => a.order - b.order);

  sorted.forEach((stage) => {
    const cards = state.customCards.filter((c) => c.stageId === stage.id);
    const details = document.createElement("details");
    details.className = "zone stage-zone custom-stage-zone";
    details.open = true;
    details.dataset.stageId = stage.id;

    // Summary row
    const summary = document.createElement("summary");

    const nameWrap = document.createElement("span");
    nameWrap.className = "stage-name-wrap";

    const nameSpan = document.createElement("span");
    nameSpan.className = "stage-name-display";
    const KNOWN_STAGE_NAMES = { "我的工具箱": "myToolbox" };
    nameSpan.textContent = KNOWN_STAGE_NAMES[stage.name] ? t(KNOWN_STAGE_NAMES[stage.name]) : stage.name;

    const editIcon = document.createElement("button");
    editIcon.className = "stage-edit-icon";
    editIcon.type = "button";
    editIcon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25zm14.71-9.04a1 1 0 0 0 0-1.41l-1.5-1.5a1 1 0 0 0-1.41 0l-1.13 1.12 3.75 3.75 1.29-1.96z"/></svg>';
    editIcon.title = t("rename");
    editIcon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const input = document.createElement("input");
      input.type = "text";
      input.className = "stage-name-input";
      input.value = stage.name;
      nameSpan.replaceWith(input);
      editIcon.style.display = "none";
      input.focus();
      input.select();
      const finish = (commit) => {
        const v = input.value.trim();
        if (commit && v && v !== stage.name) renameCustomStage(stage.id, v);
        else renderCustomStages();
      };
      input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") finish(true); if (ev.key === "Escape") finish(false); });
      input.addEventListener("blur", () => finish(true));
    });

    nameWrap.append(nameSpan, editIcon);

    const controls = document.createElement("div");
    controls.className = "stage-controls";

    const moveUp = document.createElement("button");
    moveUp.className = "stage-reorder-btn";
    moveUp.textContent = "↑";
    moveUp.title = t("moveUp");
    moveUp.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); reorderCustomStage(stage.id, "up"); });

    const moveDown = document.createElement("button");
    moveDown.className = "stage-reorder-btn";
    moveDown.textContent = "↓";
    moveDown.title = t("moveDown");
    moveDown.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); reorderCustomStage(stage.id, "down"); });

    const deleteStageBtn = document.createElement("button");
    deleteStageBtn.className = "stage-ctrl-btn danger";
    deleteStageBtn.textContent = t("deleteStage");
    deleteStageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteCustomStage(stage.id);
    });

    const addCardBtn = document.createElement("button");
    addCardBtn.className = "stage-ctrl-btn";
    addCardBtn.textContent = "+ " + t("addCardBtn").replace("+ ", "");
    addCardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      pendingStageId = stage.id;
      addModal.classList.remove("hidden");
      metaNeedInput.focus();
    });

    controls.append(moveUp, moveDown, deleteStageBtn, addCardBtn);
    summary.append(nameWrap, controls);
    details.appendChild(summary);

    // Cards
    const section = document.createElement("section");
    section.className = "cards";
    const fragment = document.createDocumentFragment();
    const items = cards.map((c) => ({ ...c, source: "custom" }));
    items.forEach((item, index) => {
      fragment.appendChild(createCard(item, "pool", index));
    });
    section.appendChild(fragment);
    details.appendChild(section);

    customStagesRoot.appendChild(details);
  });

  // 回收站
  if (state.trashedStages.length > 0) {
    const trashDetails = document.createElement("details");
    trashDetails.className = "zone stage-zone trash-zone";
    trashDetails.open = false;

    const trashSummary = document.createElement("summary");
    const trashSpan = document.createElement("span");
    trashSpan.textContent = `回收站 (${state.trashedStages.length})`;

    const emptyTrashBtn = document.createElement("button");
    emptyTrashBtn.className = "clear-trash-btn";
    emptyTrashBtn.textContent = t("emptyTrash");
    emptyTrashBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      emptyTrash();
    });

    trashSummary.append(trashSpan, emptyTrashBtn);
    trashDetails.appendChild(trashSummary);

    const trashSection = document.createElement("section");
    trashSection.className = "cards";
    state.trashedStages.forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = "trash-item";

      const nameSpan = document.createElement("span");
      nameSpan.className = "trash-item-name";
      nameSpan.textContent = entry.stage.name + (entry.cards.length > 0 ? ` (${entry.cards.length} 张卡片)` : "");

      const restoreBtn = document.createElement("button");
      restoreBtn.className = "stage-ctrl-btn";
      restoreBtn.textContent = t("restore");
      restoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        restoreTrashedStage(index);
      });

      row.append(nameSpan, restoreBtn);
      trashSection.appendChild(row);
    });
    trashDetails.appendChild(trashSection);
    customStagesRoot.appendChild(trashDetails);
  }
}

function renderList(root, items, zone) {
  root.innerHTML = "";
  const fragment = document.createDocumentFragment();

  if (zone === "common") {
    items.forEach((item, index) => {
      const card = createCard(item, zone, index);
      fragment.appendChild(card);
    });
    root.appendChild(fragment);
    return;
  }

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-tip";
    if (zone === "pool") {
      empty.textContent = t("emptyBench");
    } else {
      empty.textContent = t("emptyCards");
    }
    root.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const card = createCard(item, zone, index);
    fragment.appendChild(card);
  });
  root.appendChild(fragment);
}

function createCard(item, zone, index) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  node.style.setProperty("--delay", `${Math.min(index * 40, 520)}ms`);
  node.dataset.cardId = item.id;
  node.dataset.zone = zone;
  if (item.source === "custom") node.classList.add("custom-card");

  const title = node.querySelector(".card-title");
  const input = node.querySelector(".card-input");
  const copyBtn = node.querySelector(".copy-btn");
  const previewToggleBtn = node.querySelector(".preview-toggle-btn");
  const deleteBtn = node.querySelector(".card-delete-fold");
  const status = node.querySelector(".copy-status");
  const preview = node.querySelector(".card-preview");
  const previewPre = preview ? preview.querySelector("pre") : null;

  const editPanel = node.querySelector(".edit-panel");
  const editTitleInput = node.querySelector(".edit-title");
  const editPromptInput = node.querySelector(".edit-prompt");
  const saveEditBtn = node.querySelector(".save-edit-btn");
  const cancelEditBtn = node.querySelector(".cancel-edit-btn");

  title.textContent = translateCardTitle(item.title);
  input.placeholder = item.hint || t("inputPlaceholder");
  if (previewPre) previewPre.textContent = item.prompt;

  // Usage count badge
  const usageBadge = node.querySelector(".card-usage");
  const uc = getUsageCount(item.id);
  if (usageBadge) {
    if (uc > 0) {
      usageBadge.textContent = uc;
    } else {
      usageBadge.style.display = "none";
    }
  }

  // Preview toggle
  if (previewToggleBtn && preview) {
    previewToggleBtn.addEventListener("click", () => {
      const isOpen = preview.classList.toggle("open");
      node.style.zIndex = isOpen ? 10 : "";
    });
  }
  input.value = inputStore.get(item.id) || "";

  const isCustomCard = item.source === "custom";
  if (isCustomCard) {
    title.classList.add("editable-title");
    deleteBtn.classList.remove("hidden");
  } else {
    deleteBtn.classList.add("hidden");
  }

  input.addEventListener("input", () => {
    inputStore.set(item.id, input.value);
  });

  copyBtn.addEventListener("click", async () => {
    const content = mergePromptAndInput(item.prompt, input.value);
    if (input.value.trim()) {
      const nextCount = incrementUsageCount(item.id, { skipRender: true });
      const usageNode = node.querySelector(".card-usage");
      if (usageNode) {
        usageNode.textContent = nextCount;
        usageNode.style.display = "";
      }
    }
    try {
      await copyToClipboard(content);
      setStatus(status, "已复制到剪贴板", "success");
    } catch (error) {
      setStatus(status, "复制失败，请手动复制", "error");
    }
  });

  title.addEventListener("click", () => {
    if (!isCustomCard) return;
    if (node.querySelector(".inline-title-edit")) return;
    const inlineInput = document.createElement("input");
    inlineInput.type = "text";
    inlineInput.className = "inline-title-edit";
    inlineInput.value = item.title;
    inlineInput.setAttribute("aria-label", "编辑标题");
    inlineInput.style.width = "100%";
    inlineInput.style.font = "inherit";
    inlineInput.style.padding = "4px 6px";
    inlineInput.style.borderRadius = "8px";
    inlineInput.style.border = "1px solid rgba(20, 34, 58, 0.24)";

    title.classList.add("hidden");
    title.parentNode.insertBefore(inlineInput, title);
    inlineInput.focus();
    inlineInput.select();

    const finish = (commit) => {
      const newTitle = inlineInput.value.trim();
      inlineInput.remove();
      title.classList.remove("hidden");
      if (!commit) return;
      if (!newTitle) { setStatus(status, t("titleEmpty"), "error"); return; }
      if (newTitle === item.title) return;
      updateCard(item.id, newTitle, item.prompt);
    };

    inlineInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); finish(true); }
      else if (event.key === "Escape") { event.preventDefault(); finish(false); }
    });
    inlineInput.addEventListener("blur", () => finish(true));
  });

  saveEditBtn.addEventListener("click", () => { editPanel.classList.add("hidden"); });
  cancelEditBtn.addEventListener("click", () => { editPanel.classList.add("hidden"); });

  deleteBtn.addEventListener("click", () => { deleteCard(item.id); });

  node.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  node.querySelectorAll("[data-i18n-tooltip]").forEach((el) => {
    el.dataset.tooltip = t(el.dataset.i18nTooltip);
  });

  return node;
}

function bindAddCardPanel() {
  if (
    !addModal ||
    !addModalMask ||
    !metaTemplateInput ||
    !metaNeedInput ||
    !copyMetaBtn ||
    !metaStatusText ||
    !addPromptInput ||
    !createCardBtn ||
    !addStatusText
  ) {
    return;
  }

  metaTemplateInput.value = getMetaTemplateText();

  if (addStageBtn) {
    addStageBtn.addEventListener("click", () => {
      addCustomStage("未命名");
    });
  }

  addModalMask.addEventListener("click", () => {
    closeAddPanel();
  });

  copyMetaBtn.addEventListener("click", async () => {
    const need = metaNeedInput.value.trim();
    if (!need) {
      metaStatusText.textContent = t("pleaseFillNeed");
      metaStatusText.className = "meta-status error";
      metaNeedInput.focus();
      return;
    }
    const output = getMetaTemplateText().replace(getMetaInputPlaceholder(), need);
    try {
      await copyToClipboard(output);
      metaStatusText.textContent = t("copiedMeta");
      metaStatusText.className = "meta-status success";
    } catch (error) {
      metaStatusText.textContent = t("copyFailedManual");
      metaStatusText.className = "meta-status error";
    }
  });

  createCardBtn.addEventListener("click", () => {
    const parsed = parseGeneratedSkill(addPromptInput.value);
    if (!parsed) {
      addStatusText.textContent = t("pleasePasteFull");
      addStatusText.className = "add-status error";
      return;
    }
    addNewCard(parsed.title, parsed.prompt, parsed.hint);
    closeAddPanel();
  });

}

function closeAddPanel() {
  if (!addModal) {
    return;
  }
  addModal.classList.add("hidden");
  metaNeedInput.value = "";
  metaStatusText.textContent = "";
  metaStatusText.className = "meta-status";
  addPromptInput.value = "";
  addStatusText.textContent = "";
  addStatusText.className = "add-status";
}

function bindLangControls() {
  // Language controls
  const uiLangBtn = document.getElementById("uiLangBtn");
  const skillLangWrap = document.getElementById("skillLangWrap");

  if (uiLangBtn) {
    uiLangBtn.addEventListener("click", () => {
      updateUiLang(uiLang === "zh" ? "en" : "zh");
    });
  }

  if (skillLangWrap) {
    skillLangWrap.querySelectorAll(".segment-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        updateSkillLang(btn.dataset.lang);
      });
    });
  }

  // Initialize button states
  const savedLang = localStorage.getItem("ui-lang") || "zh";
  if (savedLang === "en") {
    updateUiLang("en");
  } else {
    applyStaticI18n();
    const uiLangText = document.getElementById("uiLangText");
    if (uiLangText) uiLangText.textContent = "中";
    if (skillLangWrap) {
      skillLangWrap.querySelectorAll(".segment-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.lang === (currentPromptLang === "en" ? "en" : "zh"));
      });
      skillLangWrap.classList.remove("hidden");
    }
  }
}













function switchToLayout1() {
  if (!layout1Rendered) {
    render();
    layout1Rendered = true;
  }
  if (layout1El) layout1El.classList.remove("hidden");
  document.querySelector(".bg-layer-a").classList.remove("hidden");
  document.querySelector(".bg-layer-b").classList.remove("hidden");
  document.querySelector(".floating-actions").classList.remove("hidden");
}

function parseGeneratedSkill(rawText) {
  const lines = String(rawText || "")
    .split(/\r?\n/)
    .map((line) => line.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length < 2) {
    return null;
  }
  let title = nonEmpty[0]
    .replace(/^#+\s*/, "")
    .replace(/^标题[:：]\s*/i, "")
    .trim();
  if (!title) return null;

  let hint = "";
  let promptLines = nonEmpty.slice(1);

  if (promptLines.length > 0) {
    const hintMatch = promptLines[0].match(/^hint[:：]\s*(.+)$/i);
    if (hintMatch) {
      hint = hintMatch[1].trim();
      promptLines = promptLines.slice(1);
    }
  }

  const prompt = promptLines.join("\n").trim();
  if (!prompt) return null;

  return { title, hint, prompt };
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && addModal && !addModal.classList.contains("hidden")) {
    closeAddPanel();
  }
});

function bindDragEvents(node, cardId) {
  node.addEventListener("dragstart", (event) => {
    draggingId = cardId;
    node.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
  });

  node.addEventListener("dragend", () => {
    draggingId = null;
    node.classList.remove("dragging");
    clearDragState();
  });

  node.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (draggingId === cardId) {
      return;
    }
    node.classList.add("drag-over");
  });

  node.addEventListener("dragleave", () => {
    node.classList.remove("drag-over");
  });

  node.addEventListener("drop", (event) => {
    event.preventDefault();
    node.classList.remove("drag-over");
    const sourceId = draggingId || event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === cardId) {
      return;
    }
    reorderCommon(sourceId, cardId);
  });
}

function clearDragState() {
  document.querySelectorAll(".card.drag-over").forEach((node) => {
    node.classList.remove("drag-over");
  });
}

function reorderCommon(sourceId, targetId) {
  const arr = [...state.commonIds];
  const sourceIndex = arr.indexOf(sourceId);
  const targetIndex = arr.indexOf(targetId);
  if (sourceIndex === -1 || targetIndex === -1) {
    return;
  }
  const [moved] = arr.splice(sourceIndex, 1);
  const insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  arr.splice(insertIndex, 0, moved);
  state.commonIds = arr;
  commitState();
}

function moveCommonToEnd(cardId) {
  const arr = state.commonIds.filter((id) => id !== cardId);
  arr.push(cardId);
  state.commonIds = arr;
  commitState();
}

function addToCommon(cardId) {
  if (state.commonIds.includes(cardId)) {
    return;
  }
  state.commonIds = [...state.commonIds, cardId];
  commitState();
}

function removeFromCommon(cardId) {
  state.commonIds = state.commonIds.filter((id) => id !== cardId);
  resetUsageCount(cardId);
  commitState();
}

function addNewCard(title, prompt, hint) {
  const id = buildCustomCardId();
  let category = "未分类";
  let stageId = "";
  let stageNum = "";

  if (pendingStageId.startsWith("builtin:")) {
    stageNum = pendingStageId.slice(8);
    category = t("stage" + stageNum);
  } else if (pendingStageId) {
    const stage = state.customStages.find((s) => s.id === pendingStageId);
    category = stage ? stage.name : "未分类";
    stageId = pendingStageId;
  }

  state.customCards.push({ id, title, category, prompt, stageId, stageNum, hint });
  pendingStageId = "";
  commitState();
}

function updateCard(cardId, newTitle, newPrompt) {
  const item = allItems.find((card) => card.id === cardId);
  if (!item) {
    return;
  }

  if (item.source === "custom") {
    state.customCards = state.customCards.map((card) =>
      card.id === cardId ? { ...card, title: newTitle, prompt: newPrompt } : card
    );
  } else {
    state.editedCards[cardId] = {
      title: newTitle,
      prompt: newPrompt,
    };
  }
  commitState();
}

function deleteCard(cardId) {
  const item = allItems.find((card) => card.id === cardId);
  if (!item) {
    return;
  }

  if (item.source === "custom") {
    state.customCards = state.customCards.filter((card) => card.id !== cardId);
  } else {
    if (!state.deletedCardIds.includes(cardId)) {
      state.deletedCardIds.push(cardId);
    }
  }

  delete state.editedCards[cardId];
  state.commonIds = state.commonIds.filter((id) => id !== cardId);
  resetUsageCount(cardId);
  inputStore.delete(cardId);
  commitState();
}

function getUsageCount(cardId) {
  const map = state.usageCountById || {};
  const value = Number(map[cardId] || 0);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

function incrementUsageCount(cardId, options) {
  if (!state.usageCountById || typeof state.usageCountById !== "object") {
    state.usageCountById = {};
  }
  const current = getUsageCount(cardId);
  const next = current + 1;
  state.usageCountById[cardId] = next;
  saveState();
  if (!options || !options.skipRender) {
    render({ suppressAnimation: true });
  }
  return next;
}

function resetUsageCount(cardId) {
  if (!state.usageCountById || typeof state.usageCountById !== "object") {
    return;
  }
  if (state.usageCountById[cardId]) {
    delete state.usageCountById[cardId];
  }
}

function resetAllUsageCount() {
  state.usageCountById = {};
  commitState();
}

function applyUsageSort() {
  // Sorting by usage within stages — to be implemented if needed
}

function buildCustomCardId() {
  const existing = new Set(allItems.map((item) => item.id));
  let id = "";
  do {
    id = `custom-${Math.random().toString(36).slice(2, 9)}`;
  } while (existing.has(id));
  return id;
}

function commitState(options = {}) {
  refreshAllItems();
  saveState();
  render(options);
}

function refreshAllItems() {
  const deleted = new Set(state.deletedCardIds);
  const seen = new Set();
  const output = [];

  baseCardIds.forEach((id) => {
    if (deleted.has(id)) return;
    const card = getCardFromBank(id);
    if (card && !seen.has(id)) {
      seen.add(id);
      output.push(card);
    }
  });

  state.customCards.forEach((item) => {
    if (!item || !item.id || !item.title || !item.prompt) return;
    if (seen.has(item.id)) return;
    seen.add(item.id);
    output.push({
      ...item,
      hint: item.hint || "",
      source: "custom",
    });
  });

  allItems = output;
}

function normalizeCommonIds(ids, items) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }
  const validSet = new Set(items.map((item) => item.id));
  const normalized = [];
  ids.forEach((id) => {
    if (validSet.has(id) && !normalized.includes(id)) {
      normalized.push(id);
    }
  });
  return normalized;
}

function buildDefaultCommonIds(items) {
  if (DEFAULT_COMMON_TITLES.length === 0) {
    return [];
  }
  const byTitle = new Map(items.map((item) => [item.title, item.id]));
  const selected = [];

  DEFAULT_COMMON_TITLES.forEach((title) => {
    const id = byTitle.get(title);
    if (id && !selected.includes(id)) {
      selected.push(id);
    }
  });

  const fallback = items.map((item) => item.id).filter((id) => !selected.includes(id));
  while (selected.length < Math.min(4, items.length) && fallback.length > 0) {
    selected.push(fallback.shift());
  }

  return selected;
}

function createDefaultState() {
  return {
    commonIds: [],
    customCards: [],
    customStages: [],
    trashedStages: [],
    usageCountById: {},
    sortByUsage: false,
    editedCards: {},
    deletedCardIds: [],
    userCardsSeeded: false,
  };
}

function seedDefaultUserCards() {
  if (state.userCardsSeeded) {
    // Reset if state was corrupted (seeded but no cards and no stages)
    if (state.customCards.length === 0 && state.customStages.length === 0) {
      state.userCardsSeeded = false;
      // Fall through to re-seed below
    }
  }
  if (state.userCardsSeeded) {
    // Migrate old cards without stageId and without stageNum into a new stage
    const orphanCards = state.customCards.filter((c) => !c.stageId && !c.stageNum);
    if (orphanCards.length > 0) {
      const stageId = state.customStages.length > 0
        ? state.customStages[0].id
        : (() => {
            const id = "stage-" + Math.random().toString(36).slice(2, 9);
            state.customStages.push({ id, name: "我的工具箱", order: 0 });
            return id;
          })();
      orphanCards.forEach((c) => { c.stageId = stageId; c.category = state.customStages.find(s => s.id === stageId)?.name || "我的工具箱"; });
      saveState();
    }
    return;
  }
  const stageId = "stage-" + Math.random().toString(36).slice(2, 9);
  state.customStages.push({ id: stageId, name: "我的工具箱", order: 0 });
  DEFAULT_USER_CARDS.forEach((card) => {
    const id = buildCustomCardId();
    state.customCards.push({
      id,
      title: card.title,
      category: "我的工具箱",
      prompt: card.prompt,
      stageId,
    });
  });
  state.userCardsSeeded = true;
  saveState();
}

function addCustomStage(name) {
  const id = "stage-" + Math.random().toString(36).slice(2, 9);
  state.customStages.push({ id, name: name || "新阶段", order: state.customStages.length });
  commitState();
  return id;
}

function renameCustomStage(stageId, newName) {
  const stage = state.customStages.find((s) => s.id === stageId);
  if (!stage) return;
  stage.name = newName;
  // Update category of all cards in this stage
  state.customCards.forEach((c) => { if (c.stageId === stageId) c.category = newName; });
  commitState();
}

function deleteCustomStage(stageId) {
  const stage = state.customStages.find((s) => s.id === stageId);
  if (!stage) return;
  const cards = state.customCards.filter((c) => c.stageId === stageId);
  state.trashedStages.push({ stage: { ...stage }, cards: cards.map((c) => ({ ...c })) });
  state.customStages = state.customStages.filter((s) => s.id !== stageId);
  state.customCards = state.customCards.filter((c) => c.stageId !== stageId);
  cards.forEach((c) => {
    state.commonIds = state.commonIds.filter((cid) => cid !== c.id);
    resetUsageCount(c.id);
    inputStore.delete(c.id);
  });
  commitState();
}

function restoreTrashedStage(trashIndex) {
  if (trashIndex < 0 || trashIndex >= state.trashedStages.length) return;
  const entry = state.trashedStages[trashIndex];
  const stage = entry.stage;
  const cards = entry.cards;
  // Restore stage
  if (!state.customStages.find((s) => s.id === stage.id)) {
    stage.order = state.customStages.length;
    state.customStages.push({ ...stage });
  }
  // Restore cards
  cards.forEach((c) => {
    if (!state.customCards.find((cc) => cc.id === c.id)) {
      state.customCards.push({ ...c });
    }
  });
  state.trashedStages.splice(trashIndex, 1);
  commitState();
}

function emptyTrash() {
  state.trashedStages = [];
  commitState();
}

function reorderCustomStage(stageId, direction) {
  const sorted = [...state.customStages].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((s) => s.id === stageId);
  if (idx === -1) return;
  const target = direction === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= sorted.length) return;
  const tmpOrder = sorted[idx].order;
  sorted[idx].order = sorted[target].order;
  sorted[target].order = tmpOrder;
  state.customStages = sorted;
  commitState();
}

function normalizeState(raw) {
  const next = createDefaultState();
  if (!raw || typeof raw !== "object") {
    return next;
  }

  if (Array.isArray(raw.commonIds)) {
    next.commonIds = raw.commonIds.filter((id) => typeof id === "string");
  }
  if (Array.isArray(raw.customCards)) {
    next.customCards = raw.customCards
      .filter((card) => card && typeof card === "object")
      .map((card) => ({
        id: String(card.id || "").trim(),
        title: String(card.title || "").trim(),
        category: String(card.category || "").trim() || "未分类",
        prompt: String(card.prompt || "").trim(),
        hint: card.hint ? String(card.hint).trim() : "",
        stageId: card.stageId ? String(card.stageId).trim() : "",
        stageNum: card.stageNum ? String(card.stageNum).trim() : "",
      }))
      .filter((card) => card.id && card.title && card.prompt);
    // Preserve cards without stageId for migration in seedDefaultUserCards
  }
  if (Array.isArray(raw.customStages)) {
    next.customStages = raw.customStages
      .filter((s) => s && typeof s === "object")
      .map((s, i) => ({
        id: String(s.id || "").trim(),
        name: String(s.name || "").trim() || "自定义阶段",
        order: typeof s.order === "number" ? s.order : i,
      }))
      .filter((s) => s.id && s.name);
  }
  if (Array.isArray(raw.trashedStages)) {
    next.trashedStages = raw.trashedStages
      .filter((t) => t && typeof t === "object" && t.stage)
      .map((t) => ({
        stage: {
          id: String(t.stage.id || "").trim(),
          name: String(t.stage.name || "").trim() || "自定义阶段",
          order: typeof t.stage.order === "number" ? t.stage.order : 0,
        },
        cards: Array.isArray(t.cards) ? t.cards
          .filter((c) => c && typeof c === "object")
          .map((c) => ({
            id: String(c.id || "").trim(),
            title: String(c.title || "").trim(),
            category: String(c.category || "").trim() || "未分类",
            prompt: String(c.prompt || "").trim(),
            stageId: String(c.stageId || "").trim(),
          }))
          .filter((c) => c.id && c.title && c.prompt) : [],
      }))
      .filter((t) => t.stage.id);
  }
  if (raw.usageCountById && typeof raw.usageCountById === "object") {
    Object.keys(raw.usageCountById).forEach((id) => {
      const count = Number(raw.usageCountById[id]);
      if (!id || !Number.isFinite(count) || count <= 0) {
        return;
      }
      next.usageCountById[id] = Math.floor(count);
    });
  }
  if (typeof raw.sortByUsage === "boolean") {
    next.sortByUsage = raw.sortByUsage;
  }
  if (typeof raw.userCardsSeeded === "boolean") {
    next.userCardsSeeded = raw.userCardsSeeded;
  }
  if (raw.editedCards && typeof raw.editedCards === "object") {
    Object.keys(raw.editedCards).forEach((id) => {
      const patch = raw.editedCards[id];
      if (!patch || typeof patch !== "object") {
        return;
      }
      const title = String(patch.title || "").trim();
      const prompt = String(patch.prompt || "").trim();
      if (!title || !prompt) {
        return;
      }
      next.editedCards[id] = { title, prompt };
    });
  }
  if (Array.isArray(raw.deletedCardIds)) {
    next.deletedCardIds = raw.deletedCardIds.filter((id) => typeof id === "string");
  }

  return next;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }
    return JSON.parse(raw);
  } catch (error) {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        updatedAt: Date.now(),
      })
    );
  } catch (error) {
    // Ignore persistence failures.
  }
}

function mergePromptAndInput(promptTemplate, inputText) {
  const template = (promptTemplate || "").trim();
  const userText = (inputText || "").trim();
  if (!userText) {
    return template;
  }

  const placeholderRegex = /\[在此处粘贴[^\]]*\]/g;
  if (placeholderRegex.test(template)) {
    return template.replace(placeholderRegex, userText);
  }

  return `${template}\n\n${userText}`;
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) {
    throw new Error("copy failed");
  }
}

function setStatus(element, text, stateClass) {
  element.textContent = text;
  element.classList.remove("success", "error");
  if (stateClass) {
    element.classList.add(stateClass);
  }
  clearTimeout(element._clearTimer);
  element._clearTimer = setTimeout(() => {
    element.textContent = "";
    element.classList.remove("success", "error");
  }, 2000);
}

function showNotice(text) {
  noticeText.textContent = text;
  notice.classList.remove("hidden");
}

function hideNotice() {
  notice.classList.add("hidden");
  manualLoadBtn.classList.add("hidden");
}
