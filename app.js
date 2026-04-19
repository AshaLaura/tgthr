(function () {
  const MAX_INTERESTS = 3;
  const MAX_VIBE = 3;

  const state = {
    you: {
      name: "",
      interests: [],
      drinks: [],
      budget: "",
      dietTags: [],
    },
    date: {
      stage: "",
      vibe: [],
      overlap: [],
      dietTags: [],
      goal: "",
    },
  };

  const interestMeta = [
    { id: "film", label: "Film & stories", icon: "film" },
    { id: "music", label: "Live music", icon: "music" },
    { id: "food", label: "Food & markets", icon: "food" },
    { id: "art", label: "Art & museums", icon: "art" },
    { id: "outdoors", label: "Outdoors", icon: "outdoors" },
    { id: "games", label: "Games & play", icon: "games" },
    { id: "books", label: "Books & ideas", icon: "books" },
    { id: "wellness", label: "Movement & calm", icon: "wellness" },
  ];

  const drinkMeta = [
    { id: "wine", label: "Wine", icon: "wine" },
    { id: "cocktails", label: "Cocktails", icon: "cocktails" },
    { id: "beer", label: "Beer", icon: "beer" },
    { id: "na", label: "Non-alc craft", icon: "na" },
    { id: "coffee", label: "Coffee & tea", icon: "coffee" },
    { id: "surprise", label: "Surprise me", icon: "surprise" },
  ];

  const icons = {
    film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 7h4v10H4zM14 7h6l2 3-2 3h-6zM10 7h4v10h-4z"/><circle cx="18" cy="6" r="1.5" fill="currentColor"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="7" cy="18" r="3"/><circle cx="19" cy="16" r="3"/></svg>`,
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M8 4v16M12 4v16M16 5v15"/><path d="M4 20h16"/></svg>`,
    art: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg>`,
    outdoors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 20h16M8 16l4-12 4 12M6 12h12"/></svg>`,
    games: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9.5" cy="9.5" r="1.25" fill="currentColor"/><circle cx="14.5" cy="14.5" r="1.25" fill="currentColor"/><path d="M14 8h2M13 9v2"/></svg>`,
    books: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M6 4h10a2 2 0 012 2v14a2 2 0 00-2-2H6z"/><path d="M6 4H5a2 2 0 00-2 2v14a2 2 0 002 2h1"/></svg>`,
    wellness: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3v18M8 8c0-2 2-4 4-4s4 2 4 4c0 3-4 6-4 6s-4-3-4-6z"/></svg>`,
    wine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M8 2h8v6a4 4 0 01-8 0V2z"/><path d="M12 11v11"/><path d="M9 22h6"/></svg>`,
    cocktails: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M7 4h10l-4 9v9"/><path d="M9 22h6"/><path d="M6 9h12"/></svg>`,
    beer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M6 5h9a3 3 0 013 3v7H6z"/><path d="M18 10h1.5a1.5 1.5 0 011.5 1.5V15a1.5 1.5 0 01-1.5 1.5H18"/><path d="M8 22h8"/></svg>`,
    na: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3c4 4 8 7 8 11a8 8 0 01-16 0c0-4 4-7 8-11z"/><path d="M9.5 12.5l5-5"/><circle cx="12" cy="14" r="1.25" fill="currentColor"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 6h11v9a4 4 0 01-4 4H9a4 4 0 01-4-4V6z"/><path d="M16 9h2a2 2 0 012 2v1a2 2 0 01-2 2h-2"/><path d="M8 22h6"/></svg>`,
    surprise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3l1.6 4.9H19l-4 2.9 1.5 4.7L12 14.9 7.5 15.5 9 10.8 5 7.9h5.4z"/></svg>`,
  };

  const interestLabels = {
    film: "stories & film",
    music: "live music",
    food: "food & markets",
    art: "art & museums",
    outdoors: "the outdoors",
    games: "games & play",
    books: "books & ideas",
    wellness: "movement & calm",
  };

  const drinkLabels = {
    wine: "wine",
    cocktails: "cocktails",
    beer: "beer",
    na: "non-alc craft",
    coffee: "coffee or tea",
    surprise: "a surprise pour",
  };

  const budgetCopy = {
    "1": "smart & cozy",
    "2": "a proper night out",
    "3": "full sparkle mode",
  };

  const stageLabels = {
    first: "a true first date",
    early: "an early connection",
    steady: "something steadily deepening",
    long: "a relationship with history",
  };

  const vibeLabels = {
    warm: "warm and easy",
    curious: "curious",
    witty: "witty",
    quiet: "quietly deep",
    bold: "bold",
    grounded: "grounded",
  };

  const goalLabels = {
    seen: "seen and at ease",
    spark: "playful and electric",
    closer: "closer and more honest",
    adventure: "lit up by something new",
    rest: "restored and cared for",
  };

  const activityBlueprints = {
    film: {
      easy: "Start with an indie screening or repertory cinema, then let the movie do the first half of the conversational work.",
      spark: "Build around a buzzy screening, short film night, or outdoor movie where there is plenty to react to together.",
      stretch: "Make the movie the anchor, then turn the after into a long walk or slow dessert debrief while the feelings are still fresh.",
    },
    music: {
      easy: "Pick a listening bar, jazz set, or acoustic show where you can settle in without shouting all night.",
      spark: "Lean into a lively live set with enough rhythm and movement to keep the night flirtier than formal.",
      stretch: "Make it a full music night: an intentional set, a second stop after, and room to keep talking once the encore ends.",
    },
    food: {
      easy: "Do a gentle food crawl or market wander so the plan feels social, flexible, and low-pressure.",
      spark: "Choose a place with share plates and a little scene so tasting things together becomes part of the fun.",
      stretch: "Let dinner be the main event at a place worth lingering in, with enough pacing for the conversation to deepen.",
    },
    art: {
      easy: "Start at a gallery, museum late hour, or design space that gives you natural prompts without forcing constant banter.",
      spark: "Pick an exhibit with strong point of view so you have something playful and opinionated to bounce off together.",
      stretch: "Build around an art-forward evening that feels a little transportive before easing into a slower dinner after.",
    },
    outdoors: {
      easy: "Go for a scenic walk, botanical garden, or waterfront loop where the setting keeps everything relaxed.",
      spark: "Choose an outdoor plan with a little movement and novelty so the energy stays buoyant instead of interview-like.",
      stretch: "Make the landscape part of the romance with golden-hour views, then move somewhere cozy once the light drops.",
    },
    games: {
      easy: "Start with a playful spot that gives you something to do with your hands while you get comfortable.",
      spark: "Make it lightly competitive with arcade games, bar games, or a challenge-based stop that keeps the teasing easy.",
      stretch: "Turn the whole night into a playful arc: one gamey stop, one celebratory drink, and one proper sit-down after.",
    },
    books: {
      easy: "Open with a bookstore browse or writerly cafe where conversation can meander without feeling overproduced.",
      spark: "Pick a place with a little intellectual texture so the banter has something interesting to grip onto.",
      stretch: "Let the night feel cinematic and thoughtful: a browse, a slow pour, and then a dinner built for longer talk.",
    },
    wellness: {
      easy: "Choose a tea house, bathhouse, gentle class, or calm ritual that lowers everyone's shoulders right away.",
      spark: "Keep the plan sensory and refreshing so it feels memorable without tipping into pressure.",
      stretch: "Build an unhurried, nourishing night that leaves both of you feeling more present than when you arrived.",
    },
  };

  const drinkBlueprints = {
    wine: {
      easy: "A glass of wine somewhere quiet enough to keep the conversation close.",
      spark: "A wine bar with good pours and just enough buzz to feel alive.",
      stretch: "A beautiful wine stop with a little ceremony before dinner or dessert.",
    },
    cocktails: {
      easy: "One thoughtful cocktail in a low-light room with no rush to move you along.",
      spark: "A cocktail bar with personality, strong signatures, and a little flirt in the air.",
      stretch: "A proper cocktail stop that feels occasion-worthy before the main meal.",
    },
    beer: {
      easy: "A brewery or taproom flight where the mood stays casual and easy to talk in.",
      spark: "A lively beer bar with tasting flights so there is something to compare and riff on.",
      stretch: "A polished brewery or beer-forward room that still feels like a real night out.",
    },
    na: {
      easy: "A zero-proof menu or tea-forward spot that still feels designed, not like a compromise.",
      spark: "A place with inventive non-alcoholic pours so the drinks feel fun, not dutiful.",
      stretch: "A beautifully done non-alcoholic pairing or nightcap that keeps the ritual intact.",
    },
    coffee: {
      easy: "Coffee or tea in a place with warmth, texture, and actual room to linger.",
      spark: "A cafe-to-bar handoff where the first stop feels bright and conversational.",
      stretch: "An elegant coffee or tea interlude before a longer dinner or dessert stop.",
    },
    surprise: {
      easy: "Dealer's choice at a place with a confident menu and no bad options.",
      spark: "A bar team you can trust to steer you toward something playful.",
      stretch: "A destination drink stop where the team can make the night feel a little bespoke.",
    },
  };

  const dietOptionMeta = [
    { id: "dairy_free", label: "Dairy-free" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "pescatarian", label: "Pescatarian" },
    { id: "gluten_free", label: "Gluten-free" },
    { id: "nut_allergy", label: "Nut allergy" },
  ];

  const dietOptionLabels = {
    dairy_free: "dairy-free",
    vegetarian: "vegetarian",
    vegan: "vegan",
    pescatarian: "pescatarian",
    gluten_free: "gluten-free",
    nut_allergy: "nut allergy",
  };

  function mapDietTags(ids) {
    return ids.map((id) => dietOptionLabels[id] || id.replace(/_/g, " "));
  }

  function dietFieldsHtml(tags, checkboxName) {
    const chips = dietOptionMeta
      .map((opt) => {
        const c = tags.includes(opt.id) ? "checked" : "";
        return `<label class="chip"><input type="checkbox" name="${checkboxName}" value="${opt.id}" ${c} />${opt.label}</label>`;
      })
      .join("");
    return `
      <div class="chip-grid diet-options" role="group" aria-label="Dietary preferences">
        ${chips}
      </div>`;
  }

  const STEP_PHASES = [
    "you",
    "you",
    "you",
    "you",
    "you",
    "date",
    "date",
    "date",
    "date",
    "date",
  ];

  let stepIndex = 0;
  const TOTAL_STEPS = STEP_PHASES.length;

  /** Abort listener set from previous render so caps don’t stack */
  let stepAbort = null;

  const els = {
    landing: document.getElementById("step-landing"),
    panelFlow: document.getElementById("panel-flow"),
    outro: document.getElementById("step-outro"),
    flowMount: document.getElementById("flow-mount"),
    flowHint: document.getElementById("flow-hint"),
    progressDots: document.getElementById("progress-dots"),
    progressLabel: document.getElementById("progress-label"),
    phaseTag: document.getElementById("phase-tag"),
    btnStart: document.getElementById("btn-start"),
    btnFlowExit: document.getElementById("btn-flow-exit"),
    btnFlowBack: document.getElementById("btn-flow-back"),
    btnFlowNext: document.getElementById("btn-flow-next"),
    outroSummary: document.getElementById("outro-summary"),
    outroIdeas: document.getElementById("outro-ideas"),
    btnRestart: document.getElementById("btn-restart"),
  };

  function show(el) {
    [els.landing, els.panelFlow, els.outro].forEach((node) =>
      node.classList.add("hidden")
    );
    el.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formatList(arr) {
    if (!arr.length) return "a few surprises";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
  }

  function mapInterests(ids) {
    return ids.map((id) => interestLabels[id] || id);
  }

  function mapDrinks(ids) {
    return ids.map((id) => drinkLabels[id] || id);
  }

  function mapVibes(ids) {
    return ids.map((id) => vibeLabels[id] || id);
  }

  function unique(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function pickAnchorInterest(index) {
    const anchors = unique([...state.date.overlap, ...state.you.interests, "food"]);
    return anchors[Math.min(index, anchors.length - 1)] || "food";
  }

  function pickDrinkPreference(index) {
    const picks = unique([...state.you.drinks, "coffee"]);
    return picks[index % picks.length] || "coffee";
  }

  function describeFoodFit() {
    const foodTags = unique([...state.you.dietTags, ...state.date.dietTags]);
    if (!foodTags.length) {
      return "a menu that is easy to navigate for both of you";
    }
    return `${formatList(mapDietTags(foodTags))} friendly options`;
  }

  function mealBlueprint(styleKey) {
    const baseByBudget = {
      "1": {
        easy: "Keep the meal casual but chosen: a cafe, neighborhood spot, or market-led dinner that still feels thoughtful.",
        spark: "Go for shareable plates somewhere lively so ordering becomes part of the chemistry.",
        stretch: "End at a cozy dinner spot that feels like a find rather than a splurge.",
      },
      "2": {
        easy: "Pick a comfortable sit-down restaurant where the pacing lets you exhale and stay a while.",
        spark: "Book somewhere with a little scene and a menu made for splitting a few standout things.",
        stretch: "Let dinner carry real weight with a polished room, a good server, and enough time to settle in.",
      },
      "3": {
        easy: "Even the softer version can feel special here: choose a beautiful room with gracious service and zero chaos.",
        spark: "Make the meal the sexy part with a destination restaurant and a menu worth dressing up for.",
        stretch: "Go all in on a memorable dinner that feels transporting from the first plate onward.",
      },
    };
    const tier = baseByBudget[state.you.budget] || baseByBudget["2"];
    return `${tier[styleKey]} Aim for ${describeFoodFit()}.`;
  }

  function buildIdeaCard(styleKey, title, index, why) {
    const interestId = pickAnchorInterest(index);
    const drinkId = pickDrinkPreference(index);
    const activity = activityBlueprints[interestId]?.[styleKey] || activityBlueprints.food[styleKey];
    const drink = drinkBlueprints[drinkId]?.[styleKey] || drinkBlueprints.coffee[styleKey];

    return {
      title,
      activity,
      drink,
      meal: mealBlueprint(styleKey),
      why,
    };
  }

  function renderIdeaCards(cards) {
    els.outroIdeas.innerHTML = cards
      .map(
        (card, index) => `
          <article class="idea-card">
            <p class="idea-kicker">Idea ${index + 1}</p>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.why)}</p>
            <ul class="idea-list">
              <li><strong>Activity:</strong> ${escapeHtml(card.activity)}</li>
              <li><strong>Drink:</strong> ${escapeHtml(card.drink)}</li>
              <li><strong>Meal:</strong> ${escapeHtml(card.meal)}</li>
            </ul>
          </article>`
      )
      .join("");
  }

  function pillGridInterests(selected, name) {
    const items = interestMeta
      .map((item) => {
        const checked = selected.includes(item.id) ? "checked" : "";
        const g = icons[item.icon] || "";
        return `<label class="pill icon-pill">
          <input type="checkbox" name="${name}" value="${item.id}" ${checked} />
          <span class="pill-glyph" aria-hidden="true">${g}</span>
          <span class="pill-label">${item.label}</span>
        </label>`;
      })
      .join("");
    return `<div class="pill-grid" role="group">${items}</div>`;
  }

  function pillGridDrinks(selected) {
    const items = drinkMeta
      .map((item) => {
        const checked = selected.includes(item.id) ? "checked" : "";
        const g = icons[item.icon] || "";
        return `<label class="pill icon-pill">
          <input type="checkbox" name="youDrinks" value="${item.id}" ${checked} />
          <span class="pill-glyph" aria-hidden="true">${g}</span>
          <span class="pill-label">${item.label}</span>
        </label>`;
      })
      .join("");
    return `<div class="pill-grid pill-grid--drinks" role="group">${items}</div>`;
  }

  function renderStepContent(idx) {
    switch (idx) {
      case 0:
        return `
          <p class="flow-q">What should we call you?</p>
          <p class="flow-sub">Totally optional — nicknames welcome.</p>
          <div class="field-row">
            <label class="sr-only" for="fld-name">Name</label>
            <input type="text" id="fld-name" maxlength="80" placeholder="First name or nickname" value="${escapeAttr(
              state.you.name
            )}" autocomplete="given-name" />
          </div>`;

      case 1:
        return `
          <p class="flow-q">Tap up to <em>three</em> vibes that feel like you.</p>
          <p class="flow-sub">We’ll use these to thread your night together.</p>
          ${pillGridInterests(state.you.interests, "youInterests")}`;

      case 2:
        return `
          <p class="flow-q">What are you into drinking?</p>
          <p class="flow-sub">Pick everything that sounds good — we’ll mix the mood.</p>
          ${pillGridDrinks(state.you.drinks)}`;

      case 3:
        return `
          <p class="flow-q">What’s the budget tonight?</p>
          <p class="flow-sub">No judgment — just calibration.</p>
          <div class="budget-grid" role="radiogroup" aria-label="Budget">
            ${["1", "2", "3"]
              .map((tier) => {
                const c = state.you.budget === tier ? "checked" : "";
                const sym = "$".repeat(parseInt(tier, 10));
                const blurbs = {
                  "1": "Clever & cozy",
                  "2": "Balanced splurge",
                  "3": "Pull out the stops",
                };
                return `<label class="budget-tile">
                  <input type="radio" name="youBudget" value="${tier}" ${c} />
                  <span class="budget-symbol" aria-hidden="true">${sym}</span>
                  <span class="budget-blurb">${blurbs[tier]}</span>
                </label>`;
              })
              .join("")}
          </div>`;

      case 4:
        return `
          <p class="flow-q">Food allergies &amp; how <em>you</em> eat?</p>
          <p class="flow-sub">Tap anything that applies so we can keep you safe when we pick the meal.</p>
          ${dietFieldsHtml(state.you.dietTags, "dietPref")}`;

      case 5:
        return `
          <p class="flow-q">Where are you two at?</p>
          <p class="flow-sub">So we don’t suggest a sky-dive on a first coffee.</p>
          <div class="chip-row" role="radiogroup">
            ${[
              ["first", "First real date"],
              ["early", "Early — still discovering"],
              ["steady", "Steady — deepening"],
              ["long", "Together a while"],
            ]
              .map(
                ([val, lab]) =>
                  `<label class="chip"><input type="radio" name="stage" value="${val}" ${
                    state.date.stage === val ? "checked" : ""
                  } />${lab}</label>`
              )
              .join("")}
          </div>`;

      case 6:
        return `
          <p class="flow-q">Their energy — pick up to three.</p>
          <p class="flow-sub">Trust your gut. This steers tone, not stereotypes.</p>
          <div class="chip-grid" role="group">
            ${[
              ["warm", "Warm & easy"],
              ["curious", "Curious"],
              ["witty", "Witty"],
              ["quiet", "Quiet depth"],
              ["bold", "Bold"],
              ["grounded", "Grounded"],
            ]
              .map(([val, lab]) => {
                const c = state.date.vibe.includes(val) ? "checked" : "";
                return `<label class="chip"><input type="checkbox" name="dateVibe" value="${val}" ${c} />${lab}</label>`;
              })
              .join("")}
          </div>`;

      case 7:
        return `
          <p class="flow-q">Where do your interests overlap?</p>
          <p class="flow-sub">Up to three — the shared thread for your recipe.</p>
          ${pillGridInterests(state.date.overlap, "dateOverlap")}`;

      case 8:
        return `
          <p class="flow-q">Food allergies &amp; how <em>they</em> eat?</p>
          <p class="flow-sub">What you know helps us avoid landmines at the table. If you don’t know, now’s the time to ask.</p>
          ${dietFieldsHtml(state.date.dietTags, "dateDietPref")}`;

      case 9:
        return `
          <p class="flow-q">By the end of the night, you’d love for them to feel…</p>
          <p class="flow-sub">One tap. We’ll shape pace and payoff around it.</p>
          <div class="goal-grid" role="radiogroup">
            ${[
              ["seen", "Seen & at ease", "Soft landing, real conversation"],
              ["spark", "Playful spark", "Laughter, flirt, little risks"],
              ["closer", "Closer & more honest", "A night that opens something"],
              ["adventure", "Lit up by something new", "Shared firsts"],
              ["rest", "Restored & cared for", "Gentle, nourishing, calm"],
            ]
              .map(
                ([id, title, sub]) =>
                  `<label class="goal-card">
                    <input type="radio" name="dateGoal" value="${id}" ${
                      state.date.goal === id ? "checked" : ""
                    } />
                    <strong>${title}</strong>
                    <span>${sub}</span>
                  </label>`
              )
              .join("")}
          </div>`;

      default:
        return "";
    }
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function animateMount() {
    const inner = els.flowMount;
    inner.classList.remove("pop-in");
    void inner.offsetWidth;
    inner.classList.add("pop-in");
  }

  function render() {
    els.flowHint.textContent = "";
    els.flowMount.innerHTML = renderStepContent(stepIndex);
    animateMount();

    const phase = STEP_PHASES[stepIndex];
    els.phaseTag.textContent = phase === "you" ? "You" : "Your date";

    els.progressLabel.textContent = `${stepIndex + 1} / ${TOTAL_STEPS}`;
    els.progressDots.innerHTML = "";
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i < stepIndex) dot.classList.add("is-done");
      if (i === stepIndex) dot.classList.add("is-active");
      dot.setAttribute("aria-hidden", "true");
      els.progressDots.appendChild(dot);
    }
    els.progressDots.setAttribute("aria-valuemax", String(TOTAL_STEPS));
    els.progressDots.setAttribute("aria-valuenow", String(stepIndex + 1));

    const isLast = stepIndex === TOTAL_STEPS - 1;
    els.btnFlowNext.textContent = isLast ? "See your outline" : "Next";

    wireStepHandlers();
  }

  function readChecked(root, name) {
    return Array.from(root.querySelectorAll(`input[name="${name}"]:checked`)).map(
      (i) => i.value
    );
  }

  function collectFromDom() {
    const root = els.flowMount;
    switch (stepIndex) {
      case 0:
        state.you.name = (root.querySelector("#fld-name")?.value || "").trim();
        break;
      case 1:
        state.you.interests = readChecked(root, "youInterests");
        break;
      case 2:
        state.you.drinks = readChecked(root, "youDrinks");
        break;
      case 3: {
        const b = root.querySelector('input[name="youBudget"]:checked');
        state.you.budget = b ? b.value : "";
        break;
      }
      case 4:
        state.you.dietTags = readChecked(root, "dietPref");
        break;
      case 5: {
        const s = root.querySelector('input[name="stage"]:checked');
        state.date.stage = s ? s.value : "";
        break;
      }
      case 6:
        state.date.vibe = readChecked(root, "dateVibe");
        break;
      case 7:
        state.date.overlap = readChecked(root, "dateOverlap");
        break;
      case 8:
        state.date.dietTags = readChecked(root, "dateDietPref");
        break;
      case 9: {
        const g = root.querySelector('input[name="dateGoal"]:checked');
        state.date.goal = g ? g.value : "";
        break;
      }
      default:
    }
  }

  function validate() {
    switch (stepIndex) {
      case 0:
        return true;
      case 1:
        if (state.you.interests.length === 0) {
          els.flowHint.textContent = "Pick at least one — or we’re guessing blind.";
          return false;
        }
        if (state.you.interests.length > MAX_INTERESTS) {
          els.flowHint.textContent = `Choose up to ${MAX_INTERESTS} interests.`;
          return false;
        }
        return true;
      case 2:
        if (state.you.drinks.length === 0) {
          els.flowHint.textContent = "Pick at least one drink lane (or hit Surprise).";
          return false;
        }
        return true;
      case 3:
        if (!state.you.budget) {
          els.flowHint.textContent = "Tap a budget tier to keep us in range.";
          return false;
        }
        return true;
      case 4:
        return true;
      case 5:
        if (!state.date.stage) {
          els.flowHint.textContent = "Tell us where you’re at — we’ll tune the stakes.";
          return false;
        }
        return true;
      case 6:
        if (state.date.vibe.length === 0) {
          els.flowHint.textContent = "Pick at least one vibe.";
          return false;
        }
        if (state.date.vibe.length > MAX_VIBE) {
          els.flowHint.textContent = `Up to ${MAX_VIBE} vibes, please.`;
          return false;
        }
        return true;
      case 7:
        if (state.date.overlap.length === 0) {
          els.flowHint.textContent = "Pick at least one overlap — that’s your shared hook.";
          return false;
        }
        if (state.date.overlap.length > MAX_INTERESTS) {
          els.flowHint.textContent = `Choose up to ${MAX_INTERESTS} overlaps.`;
          return false;
        }
        return true;
      case 8:
        return true;
      case 9:
        if (!state.date.goal) {
          els.flowHint.textContent = "Choose how you want the night to land.";
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function wireStepHandlers() {
    if (stepAbort) stepAbort.abort();
    stepAbort = new AbortController();
    const sig = stepAbort.signal;

    if (stepIndex === 1) {
      enforceCapsListeners("youInterests", MAX_INTERESTS, sig);
    }
    if (stepIndex === 6) {
      enforceCapsListeners("dateVibe", MAX_VIBE, sig);
    }
    if (stepIndex === 7) {
      enforceCapsListeners("dateOverlap", MAX_INTERESTS, sig);
    }

    els.flowMount.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.type === "text") {
          e.preventDefault();
          els.btnFlowNext.click();
        }
      },
      { signal: sig }
    );
  }

  function enforceCapsListeners(name, max, sig) {
    els.flowMount.addEventListener(
      "change",
      (ev) => {
        const t = ev.target;
        if (!(t instanceof HTMLInputElement)) return;
        if (t.name !== name || t.type !== "checkbox") return;
        const checked = els.flowMount.querySelectorAll(
          `input[name="${name}"]:checked`
        );
        if (checked.length > max) {
          t.checked = false;
          els.flowHint.textContent = `Choose up to ${max}.`;
        } else {
          els.flowHint.textContent = "";
        }
      },
      { signal: sig }
    );
  }

  function goNext() {
    collectFromDom();
    if (!validate()) return;

    if (stepIndex >= TOTAL_STEPS - 1) {
      finish();
      return;
    }
    stepIndex += 1;
    render();
  }

  function goBack() {
    collectFromDom();
    if (stepIndex === 0) {
      show(els.landing);
      return;
    }
    stepIndex -= 1;
    render();
  }

  function finish() {
    const name = state.you.name ? state.you.name : "You";
    const bitsYou = mapInterests(state.you.interests);
    const drinks = mapDrinks(state.you.drinks);
    const tier = budgetCopy[state.you.budget] || "something thoughtful";
    const bitsShared = mapInterests(state.date.overlap);
    const dateVibes = mapVibes(state.date.vibe);
    const stageLabel = stageLabels[state.date.stage] || "a date with real potential";
    const goalLabel = goalLabels[state.date.goal] || "good in your bodies and glad you came";

    const tags = mapDietTags(state.you.dietTags);
    const eatingClause = tags.length ? ` For you, food-wise: ${formatList(tags)}.` : "";

    const dateTags = mapDietTags(state.date.dietTags);
    const dateFoodClause = dateTags.length ? ` For your date (best guess): ${formatList(dateTags)}.` : "";

    els.outroSummary.textContent = `${name}, here’s the read: this is ${stageLabel} with a ${tier} budget, your energy leans ${formatList(
      bitsYou
    )}, and your date is coming across ${formatList(dateVibes)}. You both light up around ${formatList(
      bitsShared
    )}, drinks are leaning ${formatList(drinks)}, and the best version of the night ends with them feeling ${goalLabel}.${eatingClause}${dateFoodClause}`;

    renderIdeaCards([
      buildIdeaCard(
        "easy",
        "The easy opener",
        0,
        "Best when you want the night to feel natural fast, with enough structure to remove awkwardness without overproducing it."
      ),
      buildIdeaCard(
        "spark",
        "The shared spark",
        1,
        "Best when you want a little more momentum and chemistry, while still staying grounded in what you actually share."
      ),
      buildIdeaCard(
        "stretch",
        "The make-it-a-night version",
        2,
        "Best when you want the plan to feel more intentional and memorable, with room for the night to open up."
      ),
    ]);

    show(els.outro);
  }

  function resetAll() {
    stepIndex = 0;
    state.you = {
      name: "",
      interests: [],
      drinks: [],
      budget: "",
      dietTags: [],
    };
    state.date = {
      stage: "",
      vibe: [],
      overlap: [],
      dietTags: [],
      goal: "",
    };
    show(els.landing);
  }

  els.btnStart.addEventListener("click", () => {
    stepIndex = 0;
    resetStateOnly();
    show(els.panelFlow);
    render();
  });

  function resetStateOnly() {
    state.you = {
      name: "",
      interests: [],
      drinks: [],
      budget: "",
      dietTags: [],
    };
    state.date = {
      stage: "",
      vibe: [],
      overlap: [],
      dietTags: [],
      goal: "",
    };
  }

  els.btnFlowExit.addEventListener("click", () => {
    show(els.landing);
  });

  els.btnFlowBack.addEventListener("click", goBack);
  els.btnFlowNext.addEventListener("click", goNext);

  els.btnRestart.addEventListener("click", resetAll);
})();
