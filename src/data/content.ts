// Bilingual content for "The Nature of Quantum Reality · 量子的本质"
// Every string is authored as an { en, zh } pair and rendered live via the <T> toggle.
// This file is the single source of truth consumed by every component on the page.

export type Bi = { en: string; zh: string };

/* ------------------------------------------------------------------ hero */

export const hero = {
  kicker: {
    en: "A Cinematic, Bilingual Cathedral of Quantum Understanding",
    zh: "一座电影级的双语量子理解殿堂",
  },
  title: {
    en: "What is reality?",
    zh: "什么是真实？",
  },
  // shown beneath the title, large
  statement: {
    en: "Reality may not exist until it is observed.",
    zh: "在被观测之前，真实或许并不存在。",
  },
  subtitle: {
    en: "Beneath every solid thing lies a trembling sea of probability.\nThe universe is not made of stuff. It is made of possibility — collapsing, moment by moment, into the world we call real.",
    zh: "在每一件坚实之物之下，都涌动着一片概率的颤海。\n宇宙并非由实体构成，而是由可能性构成——它每时每刻坍缩，凝成我们称之为「真实」的世界。",
  },
  buttons: [
    { label: { en: "Enter the Quantum", zh: "进入量子" }, href: "#history" },
    { label: { en: "Open the Quantum Lab", zh: "打开量子实验室" }, href: "#lab" },
    { label: { en: "The Edge of Knowledge", zh: "知识的边界" }, href: "#edge" },
  ],
};

/* ------------------------------------------------------------------ nav */

export const nav = {
  brand: { en: "Quantum Reality", zh: "量子的本质" },
  hint: { en: "Scroll to descend into the quantum", zh: "向下滚动，潜入量子" },
};

/* ------------------------------------------------------------------ sections */

export type Section = {
  id: string;
  num: string;
  accent: "synapse" | "pulse" | "awaken";
  nav: Bi;
  eyebrow: Bi;
  title: Bi;
  lead: Bi;
  paras: Bi[];
  questions: Bi[];
  quote: Bi;
};

export const sections: Section[] = [
  {
    id: "history",
    num: "01",
    accent: "pulse",
    nav: { en: "History", zh: "历史" },
    eyebrow: { en: "From Planck to the Quantum Computer", zh: "从普朗克到量子计算机" },
    title: {
      en: "The century that broke the world open.",
      zh: "那个把世界劈开的世纪。",
    },
    lead: {
      en: "In 1900, to fix one stubborn graph of glowing heat, Max Planck guessed that energy comes in indivisible grains. He thought it a mathematical trick. It was the first crack in classical reality.",
      zh: "1900 年，为了拟合一条关于炽热辐射的顽固曲线，马克斯·普朗克猜测能量是以不可分割的颗粒出现的。他以为这只是数学上的把戏，那却是经典实在裂开的第一道缝。",
    },
    paras: [
      {
        en: "Within thirty years, that crack had swallowed the world. Einstein gave light its particles, Bohr quantized the atom, de Broglie gave matter its waves. Heisenberg and Schrödinger built two seemingly different machines for the same impossible truth — and discovered they were the same machine.",
        zh: "在随后的三十年里，这道裂缝吞没了整个世界。爱因斯坦赋予光以粒子，玻尔将原子量子化，德布罗意又赋予物质以波。海森堡与薛定谔为同一个不可能的真理造出两台看似迥异的机器——最终发现它们本是同一台。",
      },
      {
        en: "The old certainties dissolved. A particle no longer had a position and a momentum waiting to be found; it had a wavefunction — a cloud of every possibility at once. Measurement did not reveal the world. It seemed to create it.",
        zh: "旧有的确定性消融了。粒子不再拥有一个等待被发现的位置和动量；它拥有的是一个波函数——一片同时包含所有可能性的云。测量并非揭示世界，它似乎在创造世界。",
      },
      {
        en: "Einstein never made peace with it. “God does not play dice,” he wrote to Born. Bohr replied: “Einstein, stop telling God what to do.” Their debate was never resolved by argument — only, decades later, by experiment. The dice, it turned out, were real.",
        zh: "爱因斯坦始终无法与之和解。「上帝不掷骰子，」他写信给玻恩。玻尔回敬道：「爱因斯坦，别再对上帝指手画脚。」他们的争论从未由论辩裁决——直到数十年后，才由实验给出答案。事实证明，那骰子是真的。",
      },
    ],
    questions: [
      { en: "Why did nature hide its strangeness until we built machines precise enough to see atoms?", zh: "为何自然要把它的怪异隐藏起来，直到我们造出足够精密、能看见原子的机器？" },
      { en: "Was the quantum revolution a discovery — or the moment reality first answered a question we knew how to ask?", zh: "量子革命是一次发现——还是真实第一次回答了我们终于懂得如何提出的问题？" },
    ],
    quote: {
      en: "Anyone who is not shocked by quantum theory\nhas not understood it.",
      zh: "任何没有被量子理论震撼到的人，\n都还没有真正理解它。",
    },
  },
  {
    id: "world",
    num: "02",
    accent: "synapse",
    nav: { en: "The Quantum World", zh: "量子世界" },
    eyebrow: { en: "Nine Impossible Truths", zh: "九个不可能的真理" },
    title: {
      en: "The rules beneath the rules.",
      zh: "规则之下的规则。",
    },
    lead: {
      en: "Everything you have ever touched is mostly empty space, held apart by laws that have no analogue in human experience. Down here, a thing can be a wave and a particle, be in two places at once, pass through walls, and stay invisibly linked across the galaxy.",
      zh: "你触碰过的一切，绝大部分都是空荡的虚空，仅靠一些在人类经验里毫无对应的定律彼此撑开。在这底层，一个东西可以既是波又是粒子，可以同时身处两地，可以穿墙而过，还能跨越整个星系保持着无形的连结。",
    },
    paras: [
      {
        en: "These are not metaphors. They are the measured, repeatable, technologically exploited behaviour of the world at its finest grain. Your phone, the sun, the chemistry of your own cells — all of it runs on these nine quiet impossibilities.",
        zh: "这些并非比喻。它们是世界在最细微尺度上经过测量、可重复、并已被技术加以利用的真实行为。你的手机、太阳、你自身细胞里的化学反应——这一切都运行在这九个静默的「不可能」之上。",
      },
      {
        en: "Explore each below. Every concept carries its plain-language meaning, the mathematics that makes it precise, the philosophical wound it opens, and the real technology it already powers.",
        zh: "在下方逐一探索。每个概念都附有它的通俗含义、令其精确的数学、它撕开的哲学伤口，以及它早已驱动的真实技术。",
      },
    ],
    questions: [
      { en: "If matter is mostly empty, what exactly are you touching when you touch a table?", zh: "如果物质大部分是空的，那么当你触碰一张桌子时，你触碰的究竟是什么？" },
      { en: "How can a single electron interfere with itself — pass through two slits at once — yet always arrive whole?", zh: "一个电子如何能与自身干涉——同时穿过两条狭缝——却总是完整地抵达？" },
      { en: "Is superposition the world being undecided, or the world being more than one world?", zh: "叠加，是世界尚未决断，还是世界本就不止一个？" },
    ],
    quote: {
      en: "Not only is the universe stranger than we imagine —\nit is stranger than we can imagine.",
      zh: "宇宙不仅比我们想象的更奇异，\n它比我们所能想象的还要奇异。",
    },
  },
  {
    id: "lab",
    num: "03",
    accent: "pulse",
    nav: { en: "Quantum Lab", zh: "量子实验室" },
    eyebrow: { en: "Perform the Experiments Yourself", zh: "亲手做这些实验" },
    title: {
      en: "Touch the wavefunction.",
      zh: "触碰波函数。",
    },
    lead: {
      en: "Reading about the quantum is not the same as cornering it. Below, the most famous experiments in physics are alive in your browser — every photon, every qubit, every measurement computed in real time. Look, and the interference vanishes. That is not a glitch. That is the law.",
      zh: "阅读量子，与亲手把它逼到墙角，是两回事。下面，物理学中最著名的几个实验在你的浏览器里活了过来——每一个光子、每一个量子比特、每一次测量都是实时计算的。一旦你去「看」，干涉就消失了。这不是程序的故障，这就是定律本身。",
    },
    paras: [
      {
        en: "Fire single particles through two slits and watch an interference pattern build from individual dots. Switch on the which-path detector and watch it die. Rotate a qubit on the Bloch sphere with real gates. Entangle two particles and measure one to instantly fix the other.",
        zh: "让单个粒子逐一穿过双缝，看着干涉条纹从一个个孤立的亮点中浮现。打开「路径探测器」，再看着它熄灭。用真实的量子门在布洛赫球上旋转一个量子比特。让两个粒子纠缠，测量其一，便瞬间定下另一个。",
      },
      {
        en: "Nothing here is faked. The amplitudes are complex numbers; the probabilities are their squared magnitudes; the randomness is drawn fresh on every click. You are not watching a cartoon of quantum mechanics. You are running it.",
        zh: "这里没有任何造假。振幅是复数；概率是它们模的平方；随机性在每一次点击时重新抽取。你看的不是量子力学的卡通动画——你是在运行它。",
      },
    ],
    questions: [
      { en: "Why does merely knowing which slit the particle took destroy the wave pattern?", zh: "为何仅仅「知道」粒子走了哪条缝，就会摧毁波的图样？" },
      { en: "If measurement is random, where does the randomness come from — and is it truly without cause?", zh: "如果测量是随机的，这随机从何而来——它真的没有原因吗？" },
    ],
    quote: {
      en: "I think I can safely say\nthat nobody understands quantum mechanics.",
      zh: "我想我可以有把握地说，\n没有人真正懂得量子力学。",
    },
  },
  {
    id: "mind",
    num: "04",
    accent: "synapse",
    nav: { en: "Consciousness", zh: "意识" },
    eyebrow: { en: "The Observer Problem", zh: "观测者难题" },
    title: {
      en: "Does looking create the world?",
      zh: "凝视，是否创造了世界？",
    },
    lead: {
      en: "At the heart of quantum theory sits a scandal physics has never fully resolved: the measurement problem. The equations evolve smoothly and deterministically — until someone looks. Then the cloud of possibility snaps to a single fact. What counts as “looking”? A detector? A cat? A mind?",
      zh: "在量子理论的核心，盘踞着一桩物理学从未彻底解决的丑闻：测量难题。方程平滑而确定地演化——直到有人去看。于是那片可能性之云瞬间坍缩为一个事实。可什么才算「看」？一台探测器？一只猫？还是一颗心灵？",
    },
    paras: [
      {
        en: "For a century, the greatest minds have answered differently — and each answer is a different universe. The Copenhagen school says the question is meaningless; just compute. Many-Worlds says nothing collapses at all — reality splits, and so do you. Pilot-wave says the particle always had a position, guided by a hidden wave.",
        zh: "一个世纪以来，最伟大的头脑给出了不同的答案——而每个答案都是一个不同的宇宙。哥本哈根学派说这个问题毫无意义，算就是了。多世界说根本没有什么坍缩——是实在分裂了，而你也随之分裂。导波理论说粒子始终拥有位置，只是被一个隐藏的波所引导。",
      },
      {
        en: "Relational quantum mechanics goes further: there is no view from nowhere. A system's state exists only relative to another system. Reality is not a stage of facts but a web of relationships — and the observer is simply one more thread in the web.",
        zh: "关系量子力学走得更远：根本不存在「从无处俯瞰」的上帝视角。一个系统的状态只相对于另一个系统而存在。实在不是一座事实的舞台，而是一张关系之网——而观测者，不过是网中又一根丝线。",
      },
      {
        en: "Below, weigh the great interpretations side by side. None is yet ruled out. To choose one is to choose what you believe the universe is made of.",
        zh: "下面，将这些伟大的诠释并列权衡。它们至今没有一个被排除。选择其一，便是选择你相信宇宙由什么构成。",
      },
    ],
    questions: [
      { en: "Is consciousness necessary for collapse — or is the brain just one more quantum system among many?", zh: "意识对坍缩是必需的吗——还是大脑不过是众多量子系统中的又一个？" },
      { en: "If reality is relational, can there be any fact about the world that is true for everyone at once?", zh: "如果实在是关系性的，那世界上还能存在任何对所有人同时为真的事实吗？" },
    ],
    quote: {
      en: "I regard consciousness as fundamental.\nMatter is derivative from consciousness.",
      zh: "我视意识为根本，\n物质则派生自意识。",
    },
  },
  {
    id: "civilization",
    num: "05",
    accent: "awaken",
    nav: { en: "AI & Civilization", zh: "人工智能与文明" },
    eyebrow: { en: "The Quantum Future", zh: "量子的未来" },
    title: {
      en: "The age of programmable matter.",
      zh: "可编程物质的时代。",
    },
    lead: {
      en: "For a century the quantum was a thing to be understood. Now it is a thing to be engineered. We are learning to braid the wavefunction itself — to store information in superpositions, to entangle distant cities, to build minds on substrates of possibility.",
      zh: "一个世纪以来，量子是用来被理解的对象。如今，它成了被工程化的对象。我们正在学习编织波函数本身——把信息存进叠加态，让相隔遥远的城市彼此纠缠，在可能性的基质上构筑心智。",
    },
    paras: [
      {
        en: "Quantum computers do not merely go faster; they compute along paths classical machines cannot reach, exploring a space that doubles with every qubit. A quantum internet would make eavesdropping a violation of physical law. And if intelligence itself can be lifted onto quantum hardware, the boundary between mind and matter grows thin.",
        zh: "量子计算机并非只是更快；它们沿着经典机器无法企及的路径计算，探索一个每增加一个量子比特就翻倍的空间。量子互联网会让窃听成为对物理定律的违背。而如果智能本身能被托举到量子硬件之上，心智与物质之间的界线便会变得稀薄。",
      },
      {
        en: "Beneath the engineering hums a deeper claim, first whispered by Wheeler: that the universe is, at bottom, information. “It from bit.” Every particle, every field, every force may be the readout of a deeper computation. If so, then to build a quantum computer is to hold a small mirror up to the machinery of the cosmos.",
        zh: "在工程之下，回响着一个更深的论断，最早由惠勒低声道出：宇宙在根本上是信息。「万物源于比特」。每一个粒子、每一个场、每一种力，或许都是某种更深计算的读数。果真如此，那么建造一台量子计算机，便是举起一面小小的镜子，照向宇宙的运作机理。",
      },
    ],
    questions: [
      { en: "If the universe computes itself, what is the hardware — and could it ever halt?", zh: "如果宇宙在计算自身，那硬件是什么——它有可能停机吗？" },
      { en: "When a quantum mind can exist in superposition, what does it feel to be in two states at once?", zh: "当一个量子心智能够处于叠加态时，「同时身处两种状态」会是什么感觉？" },
    ],
    quote: {
      en: "It from bit. Every particle, every field of force,\nderives its function, its meaning, its very existence from information.",
      zh: "万物源于比特。每一个粒子、每一种力场，\n都从信息中获得它的功能、它的意义、乃至它的存在。",
    },
  },
  {
    id: "math",
    num: "06",
    accent: "pulse",
    nav: { en: "Mathematical Beauty", zh: "数学之美" },
    eyebrow: { en: "The Language of Reality", zh: "实在的语言" },
    title: {
      en: "The equations that dream the world.",
      zh: "那些梦见世界的方程。",
    },
    lead: {
      en: "Quantum mechanics is, before all else, a piece of mathematics of frightening beauty. A handful of symbols — a wavefunction in a complex vector space, an operator that asks a question, a number that must be real because it can be measured — and the entire dance of matter falls out as theorem.",
      zh: "在一切之前，量子力学首先是一段美得令人战栗的数学。寥寥几个符号——复向量空间中的一个波函数，一个提出问题的算符，一个因可被测量而必须为实数的数值——物质的全部舞蹈，便作为定理从中倾泻而出。",
    },
    paras: [
      {
        en: "The state of any quantum system lives as a vector in Hilbert space — a space that may have infinitely many dimensions, one for every possible answer. To measure is to project that vector onto an axis; the length of the shadow, squared, is the probability. Reality is geometry in a space we cannot see.",
        zh: "任何量子系统的状态，都作为一个向量栖身于希尔伯特空间——一个可能拥有无穷多维度的空间，每一维对应一个可能的答案。测量，就是把这个向量投影到某根轴上；那道影子长度的平方，便是概率。实在，是一种发生在我们看不见的空间里的几何。",
      },
      {
        en: "Below, a gallery of the great equations — Schrödinger, Dirac, the path integral, the uncertainty principle. Read each not as a wall of symbols but as a compressed poem: a single line that, unpacked, contains lasers, transistors, the stability of atoms, and antimatter predicted by an equation before anyone had seen it.",
        zh: "下面是一座伟大方程的画廊——薛定谔、狄拉克、路径积分、不确定性原理。不要把每一个都读作符号之墙，而要读作一首被压缩的诗：那是一行字，一旦展开，便包含了激光、晶体管、原子的稳定性，以及一个方程在任何人见到反物质之前就已预言它的存在。",
      },
    ],
    questions: [
      { en: "Why is the universe describable by mathematics at all — and why this particular, unreasonable mathematics?", zh: "宇宙为何竟然可以被数学描述——又为何偏偏是这种不可思议的数学？" },
      { en: "Did we invent Hilbert space, or discover the room reality was always living in?", zh: "希尔伯特空间是我们发明的，还是我们发现了实在一直栖居其中的那个房间？" },
    ],
    quote: {
      en: "The miracle of the appropriateness of the language of mathematics\nfor the laws of physics is a gift we neither understand nor deserve.",
      zh: "数学语言竟如此恰切地适于表述物理定律，\n这是一份我们既不理解、也不配得的馈赠。",
    },
  },
  {
    id: "cosmos",
    num: "07",
    accent: "synapse",
    nav: { en: "Cosmic Scale", zh: "宇宙尺度" },
    eyebrow: { en: "From the Quantum to the Cosmos", zh: "从量子到宇宙" },
    title: {
      en: "The very large is built from the very strange.",
      zh: "极大，由极怪构成。",
    },
    lead: {
      en: "Zoom out far enough and the quantum seems to vanish — planets glide on smooth elliptical curves, galaxies wheel in stately silence. Yet the largest structures in existence were seeded by quantum noise, and the deepest mysteries of gravity may be quantum in disguise.",
      zh: "把镜头拉得足够远，量子仿佛消失了——行星沿着平滑的椭圆滑行，星系在庄严的沉默中旋转。然而，存在中最宏大的结构，正是由量子噪声播下的种子；而引力最深的谜团，也许只是乔装的量子。",
    },
    paras: [
      {
        en: "The galaxies trace a map of fluctuations frozen in the first fraction of a second — tiny quantum jitters in the infant universe, stretched by inflation to span the sky. Every galaxy you see is a quantum accident made cosmic.",
        zh: "众星系勾勒出的，是一幅在宇宙诞生头一瞬间被冻结的涨落地图——婴儿宇宙中微小的量子抖动，被暴胀拉伸到铺满整片天空。你看见的每一个星系，都是一桩被放大成宇宙尺度的量子偶然。",
      },
      {
        en: "At the other extreme, a black hole compresses information until it touches the quantum limit of reality itself. Its entropy is written in units of area, not volume — as if the contents of the cosmos were a hologram projected from a distant surface. Spacetime, gravity, even the dimension of depth, may be emergent: the large-scale shadow of entanglement.",
        zh: "在另一个极端，黑洞把信息压缩到触及实在本身的量子极限。它的熵以面积为单位书写，而非体积——仿佛宇宙的全部内容，是从一张遥远表面投射出的全息图。时空、引力，乃至「深度」这一维度本身，都可能是涌现的：纠缠在大尺度上投下的影子。",
      },
    ],
    questions: [
      { en: "If the cosmos is a hologram, what is the surface — and what is reading it?", zh: "如果宇宙是一张全息图，那张表面是什么——又是谁在读取它？" },
      { en: "Is gravity a fundamental force, or the thermodynamics of quantum entanglement at large scale?", zh: "引力是一种基本力，还是量子纠缠在大尺度上的热力学？" },
    ],
    quote: {
      en: "The most incomprehensible thing about the universe\nis that it is comprehensible.",
      zh: "关于宇宙最不可理解之处，\n在于它竟然可以被理解。",
    },
  },
  {
    id: "existence",
    num: "08",
    accent: "awaken",
    nav: { en: "Existence", zh: "存在" },
    eyebrow: { en: "The Philosophy of the Quantum", zh: "量子的哲学" },
    title: {
      en: "Is the world made of things, or of relations?",
      zh: "世界，是由物构成，还是由关系构成？",
    },
    lead: {
      en: "Twenty-five centuries before the double-slit, Laozi wrote that the Way that can be named is not the eternal Way, and the Buddhists taught that nothing possesses an independent self — all things arise only in dependence on all other things. The quantum did not invent these intuitions. It measured them.",
      zh: "在双缝实验之前二十五个世纪，老子写下「道可道，非常道」；佛家则说，万物皆无独立之自性——一切事物，唯有依待于其他一切事物方能生起。量子并未发明这些直觉，它只是测量了它们。",
    },
    paras: [
      {
        en: "Quantum mechanics keeps whispering that the deepest layer of reality is not a collection of separate objects with definite properties, but a single, undivided web of relations in which properties only crystallize through interaction. The observer and the observed are not two; they are one event, briefly distinguished.",
        zh: "量子力学不断低语：实在最深的那一层，并非一堆各自拥有确定属性的分离客体，而是一张单一的、不可分割的关系之网——属性只在相互作用中才结晶而成。观测者与被观测者并非二物；它们是同一桩事件，被短暂地区分开来。",
      },
      {
        en: "And so the ancient questions return, now sharpened to a physicist's edge. Is time fundamental, or does it emerge from entanglement, like temperature emerges from atoms? Is free will an illusion, or does quantum indeterminacy leave a crack of genuine openness in the future? Is consciousness the universe's way of looking back at itself?",
        zh: "于是那些古老的问题归来了，如今被磨砺出物理学家的锋刃。时间是根本的，还是像温度从原子中涌现那样，从纠缠中涌现？自由意志是幻觉，还是量子的不确定性在未来留下了一道真正敞开的缝隙？意识，是否就是宇宙回望自身的方式？",
      },
    ],
    questions: [
      { en: "Is reality, at bottom, information — or is information just our name for the patterns we can act on?", zh: "实在归根结底是信息——还是「信息」只是我们为那些可被利用的模式所起的名字？" },
      { en: "If the observer and the observed are one undivided event, who, exactly, is asking this question?", zh: "如果观测者与被观测者是同一桩不可分割的事件，那么，究竟是谁在问这个问题？" },
    ],
    quote: {
      en: "The Tao that can be told is not the eternal Tao.\nForm is emptiness; emptiness is form.",
      zh: "道可道，非常道。\n色即是空，空即是色。",
    },
  },
];

/* ------------------------------------------------------------------ closing (section 09 / edge) */

export const closing = {
  eyebrow: { en: "The Edge of Knowledge", zh: "知识的边界" },
  line: {
    en: "We are the universe\nobserving itself.",
    zh: "我们，是宇宙\n在观测它自己。",
  },
  sub: {
    en: "Made of the same trembling fields, the same collapsing possibilities — for a brief and luminous moment, a corner of the cosmos woke up, looked around, and asked what it was made of. That corner is you.",
    zh: "由同样颤动的场、同样坍缩的可能性构成——在一个短暂而明亮的瞬间，宇宙的一隅醒来了，环顾四周，问自己究竟由什么构成。那一隅，就是你。",
  },
  signature: { en: "Reality is not observed. It is participated in.", zh: "实在并非被观测，而是被参与。" },
};

/* ------------------------------------------------------------------ floating background equations */

export const equations: { tex: string; label: Bi }[] = [
  { tex: "iℏ ∂ψ/∂t = Ĥψ", label: { en: "Schrödinger", zh: "薛定谔方程" } },
  { tex: "ΔxΔp ≥ ℏ/2", label: { en: "Uncertainty", zh: "不确定性" } },
  { tex: "E = ℏω", label: { en: "Planck–Einstein", zh: "普朗克–爱因斯坦" } },
  { tex: "|ψ⟩ = α|0⟩ + β|1⟩", label: { en: "Superposition", zh: "叠加" } },
  { tex: "P = |⟨φ|ψ⟩|²", label: { en: "Born rule", zh: "玻恩定则" } },
  { tex: "(iγ^μ∂_μ − m)ψ = 0", label: { en: "Dirac", zh: "狄拉克方程" } },
  { tex: "|Φ⁺⟩ = (|00⟩+|11⟩)/√2", label: { en: "Bell state", zh: "贝尔态" } },
  { tex: "λ = h/p", label: { en: "de Broglie", zh: "德布罗意波长" } },
  { tex: "S = k log W", label: { en: "Entropy", zh: "熵" } },
  { tex: "[x̂, p̂] = iℏ", label: { en: "Canonical", zh: "正则对易" } },
  { tex: "ρ = |ψ⟩⟨ψ|", label: { en: "Density matrix", zh: "密度矩阵" } },
  { tex: "E = mc²", label: { en: "Mass–energy", zh: "质能等价" } },
];

/* ------------------------------------------------------------------ 01 · TIMELINE (History of quantum theory) */

export type TimelineEvent = {
  year: string;
  title: Bi;
  who: Bi;
  blurb: Bi;
  tag: "theory" | "experiment" | "debate" | "technology";
};

export const timeline: TimelineEvent[] = [
  { year: "1900", tag: "theory", who: { en: "Max Planck", zh: "马克斯·普朗克" },
    title: { en: "Energy comes in quanta", zh: "能量以量子形式出现" },
    blurb: { en: "To explain black-body radiation, Planck assumes energy is emitted in discrete packets, E = hν. He calls it 'an act of desperation.' The quantum is born.", zh: "为解释黑体辐射，普朗克假设能量以离散的小包发射，E = hν。他称之为「一次孤注一掷」。量子由此诞生。" } },
  { year: "1905", tag: "theory", who: { en: "Albert Einstein", zh: "阿尔伯特·爱因斯坦" },
    title: { en: "Light is made of particles", zh: "光由粒子构成" },
    blurb: { en: "Einstein explains the photoelectric effect by treating light itself as quanta — photons. The wave of light is also a hail of particles. It wins him the Nobel Prize.", zh: "爱因斯坦以「光本身即量子」——光子——解释光电效应。光的波，同时也是一阵粒子之雨。这为他赢得诺贝尔奖。" } },
  { year: "1913", tag: "theory", who: { en: "Niels Bohr", zh: "尼尔斯·玻尔" },
    title: { en: "The quantum atom", zh: "量子化的原子" },
    blurb: { en: "Bohr quantizes the atom: electrons may only occupy certain orbits, leaping between them and emitting light of precise colours. The atom's stability is explained.", zh: "玻尔将原子量子化：电子只能占据特定轨道，在轨道间跃迁并发出精确颜色的光。原子的稳定性由此得解。" } },
  { year: "1924", tag: "theory", who: { en: "Louis de Broglie", zh: "路易·德布罗意" },
    title: { en: "Matter is also a wave", zh: "物质亦是波" },
    blurb: { en: "If light waves are particles, de Broglie asks, are matter particles also waves? λ = h/p. Electrons, atoms, even molecules turn out to diffract.", zh: "德布罗意发问：既然光波是粒子，那物质粒子是否也是波？λ = h/p。电子、原子，乃至分子，结果都会发生衍射。" } },
  { year: "1925", tag: "theory", who: { en: "Werner Heisenberg", zh: "维尔纳·海森堡" },
    title: { en: "Matrix mechanics", zh: "矩阵力学" },
    blurb: { en: "On the island of Helgoland, Heisenberg builds a new mechanics from observable quantities alone — and finds that position and momentum no longer commute.", zh: "在黑尔戈兰岛上，海森堡仅凭可观测量构建出一套全新的力学——并发现位置与动量不再对易。" } },
  { year: "1926", tag: "theory", who: { en: "Erwin Schrödinger", zh: "埃尔温·薛定谔" },
    title: { en: "The wave equation", zh: "波动方程" },
    blurb: { en: "Schrödinger writes down the wave equation governing the quantum state. Soon it is proven mathematically identical to Heisenberg's matrices. Two pictures, one truth.", zh: "薛定谔写下支配量子态的波动方程。不久便被证明在数学上与海森堡的矩阵完全等价。两幅图景，同一真理。" } },
  { year: "1927", tag: "theory", who: { en: "Werner Heisenberg", zh: "维尔纳·海森堡" },
    title: { en: "The uncertainty principle", zh: "不确定性原理" },
    blurb: { en: "ΔxΔp ≥ ℏ/2. The more precisely you know where a particle is, the less you can know how fast it moves. Not a limit of instruments — a limit of reality.", zh: "ΔxΔp ≥ ℏ/2。你越精确地知道粒子在哪，就越无法知道它动得多快。这不是仪器的极限——而是实在的极限。" } },
  { year: "1927", tag: "debate", who: { en: "Bohr & Einstein", zh: "玻尔与爱因斯坦" },
    title: { en: "The Solvay duel begins", zh: "索尔维之争开始" },
    blurb: { en: "At the Fifth Solvay Conference, Einstein hurls thought experiments at Bohr to break quantum theory. Bohr parries each one. 'God does not play dice.' The argument lasts decades.", zh: "在第五届索尔维会议上，爱因斯坦向玻尔抛出一个个思想实验，意图击垮量子理论。玻尔逐一化解。「上帝不掷骰子。」这场论辩持续了数十年。" } },
  { year: "1935", tag: "debate", who: { en: "Einstein, Podolsky, Rosen", zh: "EPR 三人" },
    title: { en: "The EPR paradox", zh: "EPR 佯谬" },
    blurb: { en: "EPR argue that entanglement implies 'spooky action at a distance,' so quantum theory must be incomplete. The same year, Schrödinger names entanglement — and the cat.", zh: "EPR 论证：纠缠意味着「鬼魅般的超距作用」，因此量子理论必定是不完备的。同年，薛定谔为「纠缠」——以及那只猫——命了名。" } },
  { year: "1948", tag: "theory", who: { en: "Richard Feynman", zh: "理查德·费曼" },
    title: { en: "Sum over histories", zh: "对历史求和" },
    blurb: { en: "Feynman reformulates quantum mechanics as a sum over every possible path a particle could take. The particle, in a sense, tries all of them at once.", zh: "费曼把量子力学重新表述为「对粒子可能走过的每一条路径求和」。在某种意义上，粒子同时尝试了所有路径。" } },
  { year: "1964", tag: "theory", who: { en: "John Stewart Bell", zh: "约翰·斯图尔特·贝尔" },
    title: { en: "Bell's theorem", zh: "贝尔定理" },
    blurb: { en: "Bell proves the EPR debate is testable: no theory of local hidden variables can reproduce all quantum predictions. Philosophy becomes an experiment.", zh: "贝尔证明 EPR 之争是可检验的：任何定域隐变量理论都无法复现量子的全部预言。哲学，变成了一项实验。" } },
  { year: "1982", tag: "experiment", who: { en: "Alain Aspect", zh: "阿兰·阿斯佩" },
    title: { en: "Entanglement is real", zh: "纠缠是真实的" },
    blurb: { en: "Aspect's experiments violate Bell's inequality decisively. Einstein's 'spooky action' is confirmed. Nature is non-local. The dice are real.", zh: "阿斯佩的实验决定性地违背了贝尔不等式。爱因斯坦的「鬼魅作用」得到证实。自然是非定域的。骰子是真的。" } },
  { year: "1994", tag: "technology", who: { en: "Peter Shor", zh: "彼得·肖尔" },
    title: { en: "The quantum algorithm", zh: "量子算法" },
    blurb: { en: "Shor shows a quantum computer could factor huge numbers exponentially faster than any classical machine — threatening all modern encryption. The race begins.", zh: "肖尔证明，量子计算机能以指数级的速度分解巨大整数，远超任何经典机器——威胁着一切现代加密。竞赛由此开始。" } },
  { year: "2022", tag: "experiment", who: { en: "Nobel Prize in Physics", zh: "诺贝尔物理学奖" },
    title: { en: "The quantum gets its prize", zh: "量子赢得它的奖" },
    blurb: { en: "Aspect, Clauser and Zeilinger win the Nobel Prize for experiments with entangled photons that closed the loopholes — and opened the era of quantum information.", zh: "阿斯佩、克劳泽与蔡林格因纠缠光子实验荣获诺贝尔奖——这些实验堵上了漏洞，也开启了量子信息的时代。" } },
];

/* ------------------------------------------------------------------ 02 · THE QUANTUM WORLD (nine concepts) */

export type Concept = {
  id: string;
  glyph: string;
  name: Bi;
  tag: Bi;
  definition: Bi;
  math: string;
  interpretation: Bi;
  application: Bi;
};

export const concepts: Concept[] = [
  { id: "duality", glyph: "≈", math: "λ = h / p",
    name: { en: "Wave–Particle Duality", zh: "波粒二象性" },
    tag: { en: "Both, never neither", zh: "二者皆是，绝非皆非" },
    definition: { en: "Every quantum object is both a localized particle and a spread-out wave. Which face it shows depends entirely on how you ask. Send electrons one at a time through two slits and they still build an interference pattern — each one interferes with itself.", zh: "每一个量子客体既是定域的粒子，又是弥散的波。它向你展示哪一张面孔，完全取决于你如何发问。让电子一个一个穿过双缝，它们依然会堆叠出干涉图样——每一个都与自身发生干涉。" },
    interpretation: { en: "There is no 'real' nature underneath that is secretly one or the other. The duality is the truth; our either/or categories are the illusion.", zh: "在表象之下，并不存在一个偷偷只属于其中之一的「真实」本性。二象性本身就是真理；非此即彼的范畴，才是幻觉。" },
    application: { en: "Electron microscopes use the electron's tiny wavelength to see atoms; this very effect images the molecules of life.", zh: "电子显微镜利用电子极短的波长来观察原子；正是这一效应，让生命的分子得以成像。" } },
  { id: "superposition", glyph: "+", math: "|ψ⟩ = α|0⟩ + β|1⟩",
    name: { en: "Superposition", zh: "叠加态" },
    tag: { en: "All answers at once", zh: "所有答案同时成立" },
    definition: { en: "Before measurement, a quantum system holds every possible state simultaneously, each weighted by a complex amplitude. A qubit is not 0 or 1 but a living blend of both — until you look.", zh: "在测量之前，量子系统同时持有每一个可能的状态，每个都由一个复振幅加权。一个量子比特不是 0 或 1，而是二者活生生的混合——直到你去看。" },
    interpretation: { en: "Is superposition the world being genuinely undecided, or the world being many worlds we cannot see at once? The mathematics is silent; only interpretation answers.", zh: "叠加，是世界真正尚未决断，还是世界本是我们无法同时看见的众多世界？数学对此沉默；唯有诠释作答。" },
    application: { en: "Superposition is the raw power of quantum computing: n qubits explore 2ⁿ possibilities in parallel.", zh: "叠加是量子计算的原始力量：n 个量子比特并行探索 2ⁿ 种可能。" } },
  { id: "entanglement", glyph: "∞", math: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
    name: { en: "Entanglement", zh: "量子纠缠" },
    tag: { en: "Two bodies, one fate", zh: "两体，一命" },
    definition: { en: "Two particles can share a single quantum state so completely that neither has its own. Measure one and the other answers instantly — even across the galaxy. Einstein called it 'spooky action at a distance.' It is real.", zh: "两个粒子可以共享一个量子态，彻底到任何一个都不再拥有自己的状态。测量其一，另一个便瞬间作答——哪怕相隔整个星系。爱因斯坦称之为「鬼魅般的超距作用」。它是真的。" },
    interpretation: { en: "Entanglement says the deepest reality is not local. The whole is prior to the parts; separation may be the illusion, and connection the ground.", zh: "纠缠告诉我们，最深的实在并非定域的。整体先于部分；分离也许才是幻觉，而连结才是根基。" },
    application: { en: "Entanglement powers quantum teleportation, unbreakable quantum cryptography, and the future quantum internet.", zh: "纠缠驱动着量子隐形传态、不可破译的量子密码学，以及未来的量子互联网。" } },
  { id: "tunneling", glyph: "⊳", math: "T ≈ e^(−2κL)",
    name: { en: "Quantum Tunneling", zh: "量子隧穿" },
    tag: { en: "Through the impossible wall", zh: "穿过不可能之墙" },
    definition: { en: "A particle facing a barrier it has no energy to climb can simply appear on the other side — because its wavefunction leaks through. The thicker the wall, the rarer the miracle, but never zero.", zh: "一个粒子面对它没有能量翻越的势垒，却能径直出现在另一侧——因为它的波函数渗透了过去。墙越厚，奇迹越罕见，但永不为零。" },
    interpretation: { en: "Tunneling dissolves the classical line between possible and impossible. There are no walls in the quantum world, only probabilities of passage.", zh: "隧穿消解了经典世界中「可能」与「不可能」之间的界线。量子世界里没有墙，只有穿越的概率。" },
    application: { en: "The Sun shines by tunneling; flash memory, tunnel diodes and the scanning tunneling microscope all run on it.", zh: "太阳因隧穿而发光；闪存、隧道二极管和扫描隧道显微镜，全都依赖于它。" } },
  { id: "uncertainty", glyph: "Δ", math: "Δx · Δp ≥ ℏ/2",
    name: { en: "The Uncertainty Principle", zh: "不确定性原理" },
    tag: { en: "Knowledge has a price", zh: "知识自有代价" },
    definition: { en: "You cannot know both the position and the momentum of a particle with perfect precision. Sharpen one and the other blurs — not because your tools are crude, but because the particle does not possess both sharp values at once.", zh: "你无法同时以完美精度知道一个粒子的位置和动量。让一个清晰，另一个就模糊——不是因为你的工具粗糙，而是因为粒子本就不同时拥有两个清晰的值。" },
    interpretation: { en: "Reality is not a set of hidden definite facts we are merely too clumsy to read. Indefiniteness is woven into existence itself.", zh: "实在并非一组隐藏的、确定的事实，只是我们太笨拙而读不出。不确定，被编织进了存在本身。" },
    application: { en: "It sets the noise floor of every measurement and forces the stability of atoms — electrons cannot spiral into the nucleus.", zh: "它设定了一切测量的噪声下限，并迫使原子保持稳定——电子无法螺旋坠入原子核。" } },
  { id: "collapse", glyph: "↯", math: "|ψ⟩ → |answer⟩",
    name: { en: "Wavefunction Collapse", zh: "波函数坍缩" },
    tag: { en: "The moment of decision", zh: "决断的瞬间" },
    definition: { en: "While unobserved, the wavefunction evolves smoothly through all its possibilities. The instant it is measured, it 'collapses' to one outcome, chosen with probability equal to the amplitude squared (the Born rule).", zh: "在未被观测时，波函数平滑地穿行于它所有的可能性之间。一旦被测量，它便「坍缩」到一个结果——以等于振幅平方的概率被选中（玻恩定则）。" },
    interpretation: { en: "What, physically, is collapse? Is it real, or an illusion of our viewpoint? This is the unsolved heart of quantum theory — the measurement problem.", zh: "坍缩在物理上究竟是什么？它是真实的，还是我们视角的幻觉？这正是量子理论中尚未解决的核心——测量难题。" },
    application: { en: "Collapse is harnessed in quantum random number generators that produce true, uncomputable randomness.", zh: "坍缩被量子随机数发生器所驾驭，用以产生真正的、不可计算的随机性。" } },
  { id: "observer", glyph: "◉", math: "M̂|ψ⟩",
    name: { en: "The Observer Effect", zh: "观测者效应" },
    tag: { en: "To look is to disturb", zh: "凝视即扰动" },
    definition: { en: "In the quantum world, observation is not passive. To measure a system is to interact with it, and that interaction irreversibly changes it. Knowing which slit a particle took destroys the interference pattern entirely.", zh: "在量子世界里，观测并非被动。测量一个系统，就是与它相互作用，而这种作用会不可逆地改变它。一旦知道粒子走了哪条缝，干涉图样便彻底消失。" },
    interpretation: { en: "The line between observer and observed blurs. Perhaps there is no 'world out there' independent of the act of measurement that brings it into focus.", zh: "观测者与被观测者之间的界线变得模糊。也许根本不存在一个独立于「使其聚焦的测量行为」之外的「外部世界」。" },
    application: { en: "Quantum key distribution uses it as a feature: any eavesdropper, by observing, leaves an unerasable mark.", zh: "量子密钥分发将其化为优势：任何窃听者，只要观测，就会留下无法抹去的痕迹。" } },
  { id: "fields", glyph: "∿", math: "φ̂(x) = Σ (â e^{ikx} + â† e^{−ikx})",
    name: { en: "Quantum Fields", zh: "量子场" },
    tag: { en: "Particles are ripples", zh: "粒子是涟漪" },
    definition: { en: "The deepest theory we have says there are no particles at all — only fields filling all of space. An electron is a ripple in the electron field; a photon, a ripple in the electromagnetic field. Particles are the quantized excitations of these fields.", zh: "我们拥有的最深理论说：根本没有粒子——只有充满全部空间的场。电子是电子场中的一道涟漪；光子，是电磁场中的一道涟漪。粒子，是这些场被量子化的激发。" },
    interpretation: { en: "Matter is not a thing but an event in a field. You are not a collection of objects but a stable pattern of excitations — a standing wave that briefly calls itself you.", zh: "物质不是一个「物」，而是场中的一桩「事件」。你不是一堆客体，而是一种稳定的激发模式——一道短暂地自称为「你」的驻波。" },
    application: { en: "Quantum field theory predicts the electron's magnetic moment to twelve decimal places — the most precise prediction in all of science.", zh: "量子场论将电子磁矩预言到小数点后十二位——这是全部科学中最精确的预言。" } },
  { id: "vacuum", glyph: "∅", math: "E₀ = ½ℏω",
    name: { en: "Zero-Point Energy & the Vacuum", zh: "零点能与真空" },
    tag: { en: "Empty space is full", zh: "虚空之中盈满" },
    definition: { en: "The quantum vacuum is not nothing. Even at absolute zero, fields cannot be perfectly still — the uncertainty principle forbids it. Empty space seethes with virtual particles flickering into and out of existence.", zh: "量子真空并非虚无。即便在绝对零度，场也无法完全静止——不确定性原理禁止这一点。空荡的空间里，虚粒子翻腾着，忽生忽灭。" },
    interpretation: { en: "There is no true emptiness. The 'nothing' from which everything came was already a roiling ocean of possibility — and may still drive the expansion of the universe.", zh: "不存在真正的空无。万物由之而来的那个「无」，本就是一片翻涌的可能性之海——并可能仍在驱动着宇宙的膨胀。" },
    application: { en: "It produces the measurable Casimir force between plates and the spontaneous glow of every laser and LED.", zh: "它在板片之间产生可测量的卡西米尔力，也带来每一束激光、每一颗 LED 的自发辉光。" } },
];

/* ------------------------------------------------------------------ 03 · LAB copy (labels for the interactive experiments) */

export const lab = {
  intro: { en: "Five live experiments. Real amplitudes, real probabilities, fresh randomness on every click.", zh: "五个实时实验。真实的振幅、真实的概率、每次点击都重新抽取的随机性。" },
  doubleSlit: {
    title: { en: "The Double-Slit Experiment", zh: "双缝实验" },
    desc: { en: "Fire particles one at a time. With both slits open and no detector, an interference pattern builds — proof each particle went through both. Switch on the which-path detector and the pattern collapses to two plain bands. The act of knowing changes the world.", zh: "一次只发射一个粒子。当两条缝都开着、且无探测器时，干涉条纹逐渐浮现——证明每个粒子都同时穿过了两条缝。打开「路径探测器」，图样便坍缩为两条朴素的亮带。「知道」这一行为，改变了世界。" },
    observe: { en: "Which-path detector", zh: "路径探测器" },
    fire: { en: "Fire particle", zh: "发射粒子" },
    auto: { en: "Rapid fire", zh: "连续发射" },
    reset: { en: "Reset screen", zh: "重置屏幕" },
    count: { en: "Particles detected", zh: "已探测粒子" },
    waveMode: { en: "Wave · interference", zh: "波 · 干涉" },
    particleMode: { en: "Particle · which-path known", zh: "粒子 · 路径已知" },
  },
  bloch: {
    title: { en: "The Bloch Sphere", zh: "布洛赫球" },
    desc: { en: "Every state of a single qubit is a point on this sphere. The poles are |0⟩ and |1⟩; everywhere else is superposition. Apply real quantum gates and watch the state vector turn. Measure, and it snaps to a pole — with the probability the geometry dictates.", zh: "单个量子比特的每一个状态，都是这个球面上的一个点。两极是 |0⟩ 与 |1⟩；其余各处皆为叠加。施加真实的量子门，观察态矢量的旋转。测量它，它便瞬间跳向某一极——以几何所决定的概率。" },
    gates: { en: "Apply gate", zh: "施加量子门" },
    measure: { en: "Measure", zh: "测量" },
    reset: { en: "Reset to |0⟩", zh: "重置为 |0⟩" },
    p0: { en: "P(0)", zh: "P(0)" },
    p1: { en: "P(1)", zh: "P(1)" },
  },
  entangle: {
    title: { en: "Entangled Pair", zh: "纠缠对" },
    desc: { en: "Two particles share the Bell state (|00⟩+|11⟩)/√2. Each is individually random — but measure them and they always agree. Measure one here and watch its distant partner instantly take the matching value. No signal travels. The correlation was always there.", zh: "两个粒子共享贝尔态 (|00⟩+|11⟩)/√2。各自看来都是随机的——但一旦测量，它们总是一致。在此测量其一，看着它遥远的伙伴瞬间取到相同的值。没有信号传递。那关联，一直都在。" },
    measureA: { en: "Measure particle A", zh: "测量粒子 A" },
    measureB: { en: "Measure particle B", zh: "测量粒子 B" },
    reset: { en: "New entangled pair", zh: "新建纠缠对" },
    trials: { en: "Trials", zh: "试验次数" },
    agree: { en: "Agreement", zh: "一致率" },
  },
  circuit: {
    title: { en: "Quantum Circuit Playground", zh: "量子电路实验台" },
    desc: { en: "Build a two-qubit circuit gate by gate. Hadamards create superposition; the CNOT creates entanglement. The bar chart shows the live probability of every output — measure the whole register and watch one outcome win.", zh: "逐门搭建一个双量子比特电路。阿达玛门制造叠加；受控非门（CNOT）制造纠缠。柱状图实时显示每个输出的概率——测量整个寄存器，看着某一个结果胜出。" },
    add: { en: "Add gate", zh: "添加门" },
    run: { en: "Measure register", zh: "测量寄存器" },
    clear: { en: "Clear circuit", zh: "清空电路" },
  },
  rng: {
    title: { en: "Quantum Randomness", zh: "量子随机性" },
    desc: { en: "Put a qubit in equal superposition and measure it: the result is a coin flip no algorithm can predict, drawn from the deepest randomness in nature. Generate a stream and watch it converge — perfectly fair, perfectly unpredictable.", zh: "把一个量子比特置于均等叠加态再测量它：结果是一次任何算法都无法预测的掷币，取自自然界最深处的随机。生成一串比特，看它逐渐收敛——绝对公平，绝对不可预测。" },
    flip: { en: "Measure one qubit", zh: "测量一个量子比特" },
    stream: { en: "Generate 256 bits", zh: "生成 256 比特" },
    reset: { en: "Clear", zh: "清空" },
    zeros: { en: "Zeros", zh: "零" },
    ones: { en: "Ones", zh: "一" },
  },
};

/* ------------------------------------------------------------------ 04 · INTERPRETATIONS */

export type Interpretation = {
  id: string;
  name: Bi;
  year: string;
  tagline: Bi;
  collapse: Bi;
  reality: Bi;
  cost: Bi;
  who: Bi;
};

export const interpretations: Interpretation[] = [
  { id: "copenhagen", year: "1927", who: { en: "Bohr, Heisenberg", zh: "玻尔、海森堡" },
    name: { en: "Copenhagen", zh: "哥本哈根诠释" },
    tagline: { en: "Shut up and calculate.", zh: "闭嘴，算就是了。" },
    collapse: { en: "Real and irreducible. Measurement genuinely collapses the wavefunction to one outcome, at random.", zh: "真实且不可化约。测量真切地使波函数随机坍缩为一个结果。" },
    reality: { en: "There is no quantum reality between measurements — only the statistics of what we will observe.", zh: "在两次测量之间不存在量子实在——只有我们将观测到什么的统计。" },
    cost: { en: "An unexplained, magical line between the quantum and classical worlds.", zh: "在量子与经典世界之间，划下一条无从解释的、近乎魔法的分界线。" } },
  { id: "manyworlds", year: "1957", who: { en: "Hugh Everett III", zh: "休·埃弗里特三世" },
    name: { en: "Many-Worlds", zh: "多世界诠释" },
    tagline: { en: "Nothing collapses. Everything happens.", zh: "无物坍缩，万事皆生。" },
    collapse: { en: "An illusion. The wavefunction never collapses; the universe simply splits, realizing every outcome in a separate branch.", zh: "一种幻觉。波函数从不坍缩；宇宙只是分裂，在各自的分支中实现每一个结果。" },
    reality: { en: "The universal wavefunction is the whole of reality — a vast, branching tree of parallel worlds, all equally real.", zh: "宇宙波函数即实在之全部——一棵浩瀚的、不断分叉的平行世界之树，每一支都同样真实。" },
    cost: { en: "Unimaginably many unobservable universes, and copies of you in all of them.", zh: "数量多到无法想象的、不可观测的宇宙，以及在其中每一个里的「你」的副本。" } },
  { id: "pilot", year: "1952", who: { en: "de Broglie, Bohm", zh: "德布罗意、玻姆" },
    name: { en: "Pilot Wave", zh: "导波理论" },
    tagline: { en: "The particle was always there.", zh: "粒子，始终在那里。" },
    collapse: { en: "Never happens. Particles always have definite positions, guided by a real, physical wave that fills all of space.", zh: "从未发生。粒子始终拥有确定的位置，由一个真实的、物理的、充满全空间的波所引导。" },
    reality: { en: "Fully deterministic. The apparent randomness comes only from our ignorance of the exact starting positions.", zh: "完全决定论的。表面的随机，只源于我们对精确初始位置的无知。" },
    cost: { en: "Explicit non-locality: the guiding wave links everything to everything, instantly.", zh: "显式的非定域性：引导波将一切瞬间连结到一切。" } },
  { id: "relational", year: "1996", who: { en: "Carlo Rovelli", zh: "卡洛·罗韦利" },
    name: { en: "Relational QM", zh: "关系量子力学" },
    tagline: { en: "States exist only between things.", zh: "状态只存在于物与物之间。" },
    collapse: { en: "Relative, not absolute. A measurement gives a definite value to one observer; for another, the pair remains entangled.", zh: "相对的，而非绝对的。一次测量对某个观测者给出确定值；对另一个观测者，这对系统仍处于纠缠。" },
    reality: { en: "There are no observer-independent facts. A system's properties exist only relative to the systems it interacts with.", zh: "不存在独立于观测者的事实。一个系统的属性，只相对于与它相互作用的系统而存在。" },
    cost: { en: "You must give up the dream of a single, shared, God's-eye reality.", zh: "你必须放弃那个单一的、共享的、上帝视角的实在之梦。" } },
  { id: "qbism", year: "2010", who: { en: "Fuchs, Mermin, Schack", zh: "福克斯、默明等" },
    name: { en: "QBism", zh: "量子贝叶斯主义" },
    tagline: { en: "The wavefunction is your belief.", zh: "波函数，是你的信念。" },
    collapse: { en: "A Bayesian update. When you learn an outcome, you simply revise your personal probabilities — like any rational agent.", zh: "一次贝叶斯更新。当你得知一个结果，你只是修正了你个人的概率——如同任何理性的行动者。" },
    reality: { en: "Quantum states are not 'out there.' They encode an agent's expectations about their own future experiences.", zh: "量子态并不「存在于外部」。它们编码的是一个行动者对自身未来经验的预期。" },
    cost: { en: "Physics becomes radically first-person. The wavefunction describes you, not the world.", zh: "物理学变得彻底以第一人称为中心。波函数描述的是你，而非世界。" } },
  { id: "simulation", year: "2003", who: { en: "Bostrom, Wheeler", zh: "博斯特罗姆、惠勒" },
    name: { en: "It-from-Bit / Simulation", zh: "万物源于比特 / 模拟假说" },
    tagline: { en: "Reality is computation.", zh: "实在即计算。" },
    collapse: { en: "Rendering on demand. The world resolves to definite values only when information is requested — like a universe computed lazily.", zh: "按需渲染。世界只在信息被请求时才解析为确定值——如同一个被「惰性计算」的宇宙。" },
    reality: { en: "At bottom, the universe is information processing. Particles are bits; physical law is the code; observation is a query.", zh: "归根结底，宇宙是信息处理。粒子是比特；物理定律是代码；观测是一次查询。" },
    cost: { en: "If true, it may be unfalsifiable — and it relocates the deepest 'why' one level up, unanswered.", zh: "若为真，它或许无法证伪——并把最深的那个「为什么」向上挪了一层，依旧无解。" } },
];

/* ------------------------------------------------------------------ 05 · FUTURES (Quantum + AI + Civilization) */

export type Future = { era: Bi; title: Bi; body: Bi; metric: Bi };

export const futures: Future[] = [
  { era: { en: "Now → 2035", zh: "当下 → 2035" },
    title: { en: "Fault-Tolerant Machines", zh: "容错量子机器" },
    metric: { en: "Logical qubits", zh: "逻辑量子比特" },
    body: { en: "Error-corrected quantum computers cross the threshold where they outperform classical supercomputers on real problems — simulating molecules, materials and catalysts atom by atom. Chemistry becomes a search, not a guess.", zh: "纠错量子计算机跨过那道门槛——在真实问题上超越经典超级计算机，逐个原子地模拟分子、材料与催化剂。化学，从此是一次「搜索」，而非「猜测」。" } },
  { era: { en: "2035 → 2050", zh: "2035 → 2050" },
    title: { en: "The Quantum Internet", zh: "量子互联网" },
    metric: { en: "Entangled nodes", zh: "纠缠节点" },
    body: { en: "Cities are linked by entanglement, not cables of light alone. Communication secured by the laws of physics; distributed quantum computers sharing a single coherent state across continents. Eavesdropping becomes a violation of nature.", zh: "城市之间以纠缠相连，而不仅是光缆。通信由物理定律守护；分布式量子计算机跨越大陆共享同一个相干态。窃听，成为对自然的违背。" } },
  { era: { en: "2050 → 2100", zh: "2050 → 2100" },
    title: { en: "Quantum Intelligence", zh: "量子智能" },
    metric: { en: "Coherent cognition", zh: "相干认知" },
    body: { en: "Machine learning runs on quantum substrates, exploring solution-spaces no classical mind could. If cognition can be lifted onto coherent hardware, an intelligence might think in superposition — holding many incompatible thoughts at once, then collapsing to insight.", zh: "机器学习运行在量子基质之上，探索任何经典心智都无法企及的解空间。如果认知能被托举到相干硬件之上，一种智能或许能以叠加态思考——同时持有许多互不相容的念头，再坍缩为洞见。" } },
  { era: { en: "Beyond", zh: "更远之处" },
    title: { en: "The Participatory Universe", zh: "参与式宇宙" },
    metric: { en: "Observers", zh: "观测者" },
    body: { en: "If 'it' comes from 'bit,' then observers are not spectators but participants in bringing reality into focus. A civilization that masters information at the quantum level does not merely study the universe — it takes part in deciding what it is.", zh: "如果「万物」源于「比特」，那么观测者就不是旁观者，而是使实在聚焦成形的参与者。一个在量子层面掌握信息的文明，便不只是研究宇宙——它参与决定宇宙是什么。" } },
];

/* ------------------------------------------------------------------ 06 · EQUATION GALLERY (Mathematical beauty) */

export type EquationCard = {
  id: string;
  name: Bi;
  tex: string;
  reading: Bi;
  meaning: Bi;
};

export const equationCards: EquationCard[] = [
  { id: "schrodinger", tex: "i\\hbar\\,\\frac{\\partial}{\\partial t}\\,|\\psi(t)\\rangle = \\hat{H}\\,|\\psi(t)\\rangle",
    name: { en: "The Schrödinger Equation", zh: "薛定谔方程" },
    reading: { en: "The rate of change of the quantum state equals the Hamiltonian — the energy operator — acting on the state.", zh: "量子态随时间的变化率，等于哈密顿量——能量算符——作用在该态上。" },
    meaning: { en: "The master law of the quantum world. It is perfectly deterministic and smooth — the randomness enters only at measurement. Everything from chemistry to transistors is contained here.", zh: "量子世界的总规律。它完全是确定且平滑的——随机性只在测量时才进入。从化学到晶体管，一切都蕴含于此。" } },
  { id: "uncertainty", tex: "\\Delta x \\,\\Delta p \\;\\geq\\; \\frac{\\hbar}{2}",
    name: { en: "Heisenberg Uncertainty", zh: "海森堡不确定性" },
    reading: { en: "The product of the uncertainty in position and the uncertainty in momentum can never fall below ℏ/2.", zh: "位置不确定度与动量不确定度的乘积，永远不会低于 ℏ/2。" },
    meaning: { en: "Not a flaw in our instruments but a law of reality: a particle simply does not possess a sharp position and a sharp momentum at the same time.", zh: "这不是仪器的缺陷，而是实在的法则：粒子根本不会同时拥有清晰的位置和清晰的动量。" } },
  { id: "dirac", tex: "\\left(i\\gamma^{\\mu}\\partial_{\\mu} - m\\right)\\psi = 0",
    name: { en: "The Dirac Equation", zh: "狄拉克方程" },
    reading: { en: "A relativistic wave equation uniting quantum mechanics with special relativity for the electron.", zh: "一个将量子力学与狭义相对论相统一、描述电子的相对论性波动方程。" },
    meaning: { en: "Its mathematics demanded the existence of antimatter — predicted on paper years before the positron was ever seen. Beauty foretold a new half of the universe.", zh: "它的数学要求反物质必须存在——在正电子被观测到的数年前，就已在纸上被预言。美，预告了宇宙的另一半。" } },
  { id: "born", tex: "P(x) = \\left|\\langle x | \\psi \\rangle\\right|^{2}",
    name: { en: "The Born Rule", zh: "玻恩定则" },
    reading: { en: "The probability of finding an outcome equals the squared magnitude of the wavefunction's amplitude for it.", zh: "得到某一结果的概率，等于波函数对该结果之振幅的模的平方。" },
    meaning: { en: "The single bridge from the smooth complex wave to the hard facts we measure. Why the square? No one fully knows. It is the deepest empirical law of physics.", zh: "从平滑的复数波，通向我们测得的硬事实之间，唯一的那座桥。为何是平方？无人完全知晓。它是物理学中最深的经验定律。" } },
  { id: "path", tex: "\\langle x_f | x_i \\rangle = \\int \\mathcal{D}[x(t)]\\; e^{\\,iS[x]/\\hbar}",
    name: { en: "The Feynman Path Integral", zh: "费曼路径积分" },
    reading: { en: "The amplitude to go from start to finish is a sum over every possible path, each weighted by the phase of its action.", zh: "从起点到终点的振幅，是对每一条可能路径的求和，每条都以其作用量的相位加权。" },
    meaning: { en: "The particle, in a sense, takes all paths at once. Classical reality is what survives when the infinitude of histories interfere — most cancel, the path of least action remains.", zh: "在某种意义上，粒子同时走遍所有路径。经典实在，是当无穷多历史相互干涉后幸存下来的东西——大多相消，唯余最小作用量之路。" } },
  { id: "bell", tex: "|\\Phi^{+}\\rangle = \\tfrac{1}{\\sqrt{2}}\\left(|00\\rangle + |11\\rangle\\right)",
    name: { en: "The Bell State", zh: "贝尔态" },
    reading: { en: "Two qubits in a maximally entangled state: both zero, or both one, in perfect superposition — never one of each.", zh: "处于最大纠缠态的两个量子比特：要么同为零，要么同为一，完美叠加——绝不一零一一。" },
    meaning: { en: "The simplest object that violates Einstein's local realism. Measuring one instantly determines the other. This single line dismantled a centuries-old picture of reality.", zh: "违背爱因斯坦定域实在论的最简单客体。测量其一，便瞬间决定另一个。这短短一行，拆解了一幅延续数世纪的实在图景。" } },
];

/* ------------------------------------------------------------------ 07 · COSMIC SCALE LADDER */

export type Scale = { power: string; meters: Bi; label: Bi; note: Bi };

export const scales: Scale[] = [
  { power: "10²⁶", meters: { en: "≈ 880 Ym", zh: "约 880 尧米" },
    label: { en: "The Observable Universe", zh: "可观测宇宙" },
    note: { en: "All the light that has had time to reach us — and every galaxy in it was seeded by a quantum fluctuation.", zh: "所有有足够时间抵达我们的光——而其中每一个星系，都由一次量子涨落播种而成。" } },
  { power: "10²¹", meters: { en: "≈ 100,000 ly", zh: "约 10 万光年" },
    label: { en: "The Milky Way", zh: "银河系" },
    note: { en: "Two hundred billion suns, bound by gravity — a force that may itself be quantum entanglement in disguise.", zh: "两千亿颗恒星，被引力束缚——而引力本身，也许只是乔装的量子纠缠。" } },
  { power: "10¹¹", meters: { en: "≈ 1 AU", zh: "约 1 天文单位" },
    label: { en: "Earth's Orbit", zh: "地球轨道" },
    note: { en: "The Sun shines only because protons quantum-tunnel through a barrier they could never classically cross.", zh: "太阳之所以发光，只因质子量子隧穿了一道经典上永远无法跨越的势垒。" } },
  { power: "10⁰", meters: { en: "1 m", zh: "1 米" },
    label: { en: "Human Scale", zh: "人的尺度" },
    note: { en: "Here the quantum hides. Decoherence smears its strangeness into the solid, classical world you can touch.", zh: "在这里，量子隐藏了起来。退相干把它的怪异抹平，化作你可触碰的、坚实的经典世界。" } },
  { power: "10⁻¹⁰", meters: { en: "≈ 1 Å", zh: "约 1 埃" },
    label: { en: "The Atom", zh: "原子" },
    note: { en: "Electrons are not tiny planets but probability clouds — standing waves whose shapes are the orbitals of chemistry.", zh: "电子不是微小的行星，而是概率云——其形状即是化学中的电子轨道的驻波。" } },
  { power: "10⁻¹⁵", meters: { en: "≈ 1 fm", zh: "约 1 飞米" },
    label: { en: "The Nucleus", zh: "原子核" },
    note: { en: "Quarks confined by the strong force, never seen alone, bound by the most violent fields in nature.", zh: "夸克被强力禁闭，从未单独现身，被自然界最剧烈的场所束缚。" } },
  { power: "10⁻³⁵", meters: { en: "≈ 1.6×10⁻³⁵ m", zh: "约 1.6×10⁻³⁵ 米" },
    label: { en: "The Planck Length", zh: "普朗克长度" },
    note: { en: "The smallest meaningful distance. Below it, space and time themselves may dissolve into quantum foam — the bedrock, or the edge, of reality.", zh: "最小的有意义的距离。在它之下，空间与时间本身或许溶解为量子泡沫——实在的基岩，抑或边界。" } },
];

/* ------------------------------------------------------------------ 08 · QUOTE WALL (Philosophy of existence) */

export type Quote = { text: Bi; author: Bi; source: Bi };

export const quotes: Quote[] = [
  { author: { en: "Niels Bohr", zh: "尼尔斯·玻尔" }, source: { en: "Physics", zh: "物理" },
    text: { en: "Everything we call real is made of things that cannot be regarded as real.", zh: "我们称之为「真实」的一切，皆由不可被视为真实之物构成。" } },
  { author: { en: "Laozi", zh: "老子" }, source: { en: "Tao Te Ching", zh: "道德经" },
    text: { en: "The Tao that can be told is not the eternal Tao. The named is the mother of ten thousand things.", zh: "道可道，非常道。名可名，非常名。" } },
  { author: { en: "John Wheeler", zh: "约翰·惠勒" }, source: { en: "It from Bit", zh: "万物源于比特" },
    text: { en: "No phenomenon is a real phenomenon until it is an observed phenomenon.", zh: "在被观测之前，没有任何现象是真实的现象。" } },
  { author: { en: "The Heart Sutra", zh: "心经" }, source: { en: "Buddhism", zh: "佛教" },
    text: { en: "Form is emptiness, emptiness is form. The same is true of feeling, perception, will, and consciousness.", zh: "色即是空，空即是色。受想行识，亦复如是。" } },
  { author: { en: "Werner Heisenberg", zh: "维尔纳·海森堡" }, source: { en: "Physics & Philosophy", zh: "物理学与哲学" },
    text: { en: "What we observe is not nature itself, but nature exposed to our method of questioning.", zh: "我们所观测的，并非自然本身，而是被我们的提问方式所揭示的自然。" } },
  { author: { en: "Carlo Rovelli", zh: "卡洛·罗韦利" }, source: { en: "Helgoland", zh: "《赫尔戈兰》" },
    text: { en: "The world is not a collection of things, it is a collection of events — a network of relations.", zh: "世界不是物的集合，而是事件的集合——一张关系之网。" } },
  { author: { en: "Erwin Schrödinger", zh: "埃尔温·薛定谔" }, source: { en: "What is Life?", zh: "《生命是什么》" },
    text: { en: "The total number of minds in the universe is one. Consciousness is a singular of which the plural is unknown.", zh: "宇宙中心灵的总数为一。意识是一种单数，其复数无人知晓。" } },
  { author: { en: "Zhuangzi", zh: "庄子" }, source: { en: "The Butterfly Dream", zh: "庄周梦蝶" },
    text: { en: "Once I dreamt I was a butterfly. Now I do not know whether I was a man dreaming I was a butterfly, or a butterfly dreaming I am a man.", zh: "昔者庄周梦为胡蝶，栩栩然胡蝶也。不知周之梦为胡蝶与，胡蝶之梦为周与？" } },
  { author: { en: "Richard Feynman", zh: "理查德·费曼" }, source: { en: "Lectures", zh: "讲义" },
    text: { en: "I think nature's imagination is so much greater than man's, she's never going to let us relax.", zh: "我想，自然的想象力远胜于人类，她永远不会让我们松懈。" } },
];
