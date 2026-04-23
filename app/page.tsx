'use client';

import { useRef, useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import { createBrowserClient } from '@/lib/supabase';
import {
  State,
  STEP_PHASES,
  MAX_INTERESTS,
  MAX_VIBE,
  budgetCopy,
  stageLabels,
  goalLabels,
  mapInterests,
  mapDrinks,
  mapVibes,
  mapDietTags,
  formatList,
  renderStepContent,
  renderIdeaCardsHtml,
  renderCityPlanHtml,
  buildIdeaCard,
} from '@/lib/questionnaire';

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const supabase = createBrowserClient();

  // — DOM refs —
  const landingRef = useRef<HTMLElement>(null);
  const panelFlowRef = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLElement>(null);
  const flowMountRef = useRef<HTMLDivElement>(null);
  const flowHintRef = useRef<HTMLParagraphElement>(null);
  const progressDotsRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const phaseTagRef = useRef<HTMLSpanElement>(null);
  const btnStartRef = useRef<HTMLButtonElement>(null);
  const btnFlowExitRef = useRef<HTMLButtonElement>(null);
  const btnFlowBackRef = useRef<HTMLButtonElement>(null);
  const btnFlowNextRef = useRef<HTMLButtonElement>(null);
  const outroSummaryRef = useRef<HTMLParagraphElement>(null);
  const outroIdeasRef = useRef<HTMLDivElement>(null);
  const outroCityPlanRef = useRef<HTMLDivElement>(null);
  const btnOaklandRef = useRef<HTMLButtonElement>(null);
  const btnSFRef = useRef<HTMLButtonElement>(null);
  const btnRestartRef = useRef<HTMLButtonElement>(null);

  // — questionnaire state (imperative, not React state) —
  const stateRef = useRef<State>({
    you: { name: '', interests: [], drinks: [], budget: '', dietTags: [] },
    date: { stage: '', vibe: [], overlap: [], dietTags: [], goal: '' },
  });
  const stepIndexRef = useRef(0);

  useEffect(() => {
    const TOTAL_STEPS = STEP_PHASES.length;
    let stepAbort: AbortController | null = null;

    function show(el: HTMLElement) {
      [landingRef.current!, panelFlowRef.current!, outroRef.current!].forEach(
        (node) => node.classList.add('hidden')
      );
      el.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function animateMount() {
      const inner = flowMountRef.current!;
      inner.classList.remove('pop-in');
      void inner.offsetWidth;
      inner.classList.add('pop-in');
    }

    function render() {
      flowHintRef.current!.textContent = '';
      flowMountRef.current!.innerHTML = renderStepContent(
        stepIndexRef.current,
        stateRef.current
      );
      animateMount();

      const phase = STEP_PHASES[stepIndexRef.current];
      phaseTagRef.current!.textContent = phase === 'you' ? 'You' : 'Your date';

      progressLabelRef.current!.textContent = `${stepIndexRef.current + 1} / ${TOTAL_STEPS}`;
      progressDotsRef.current!.innerHTML = '';
      for (let i = 0; i < TOTAL_STEPS; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i < stepIndexRef.current) dot.classList.add('is-done');
        if (i === stepIndexRef.current) dot.classList.add('is-active');
        dot.setAttribute('aria-hidden', 'true');
        progressDotsRef.current!.appendChild(dot);
      }
      progressDotsRef.current!.setAttribute('aria-valuemax', String(TOTAL_STEPS));
      progressDotsRef.current!.setAttribute('aria-valuenow', String(stepIndexRef.current + 1));

      const isLast = stepIndexRef.current === TOTAL_STEPS - 1;
      btnFlowNextRef.current!.textContent = isLast ? 'See your outline' : 'Next';

      wireStepHandlers();
    }

    function readChecked(root: HTMLElement, name: string): string[] {
      return Array.from(
        root.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)
      ).map((i) => i.value);
    }

    function collectFromDom() {
      const root = flowMountRef.current!;
      const idx = stepIndexRef.current;
      const s = stateRef.current;
      switch (idx) {
        case 0:
          s.you.name = (
            (root.querySelector('#fld-name') as HTMLInputElement)?.value || ''
          ).trim();
          break;
        case 1:
          s.you.interests = readChecked(root, 'youInterests');
          break;
        case 2:
          s.you.drinks = readChecked(root, 'youDrinks');
          break;
        case 3: {
          const b = root.querySelector<HTMLInputElement>(
            'input[name="youBudget"]:checked'
          );
          s.you.budget = b ? b.value : '';
          break;
        }
        case 4:
          s.you.dietTags = readChecked(root, 'dietPref');
          break;
        case 5: {
          const st = root.querySelector<HTMLInputElement>(
            'input[name="stage"]:checked'
          );
          s.date.stage = st ? st.value : '';
          break;
        }
        case 6:
          s.date.vibe = readChecked(root, 'dateVibe');
          break;
        case 7:
          s.date.overlap = readChecked(root, 'dateOverlap');
          break;
        case 8:
          s.date.dietTags = readChecked(root, 'dateDietPref');
          break;
        case 9: {
          const g = root.querySelector<HTMLInputElement>(
            'input[name="dateGoal"]:checked'
          );
          s.date.goal = g ? g.value : '';
          break;
        }
        default:
      }
    }

    function validate(): boolean {
      const idx = stepIndexRef.current;
      const s = stateRef.current;
      switch (idx) {
        case 0:
          return true;
        case 1:
          if (s.you.interests.length === 0) {
            flowHintRef.current!.textContent = 'Pick at least one — or we\'re guessing blind.';
            return false;
          }
          if (s.you.interests.length > MAX_INTERESTS) {
            flowHintRef.current!.textContent = `Choose up to ${MAX_INTERESTS} interests.`;
            return false;
          }
          return true;
        case 2:
          if (s.you.drinks.length === 0) {
            flowHintRef.current!.textContent =
              "Pick at least one — we'll shape a stop around it.";
            return false;
          }
          return true;
        case 3:
          if (!s.you.budget) {
            flowHintRef.current!.textContent = 'Tap a budget tier to keep us in range.';
            return false;
          }
          return true;
        case 4:
          return true;
        case 5:
          if (!s.date.stage) {
            flowHintRef.current!.textContent =
              "Tell us where you're at — we'll tune the stakes.";
            return false;
          }
          return true;
        case 6:
          if (s.date.vibe.length === 0) {
            flowHintRef.current!.textContent = 'Pick at least one vibe.';
            return false;
          }
          if (s.date.vibe.length > MAX_VIBE) {
            flowHintRef.current!.textContent = `Up to ${MAX_VIBE} vibes, please.`;
            return false;
          }
          return true;
        case 7:
          if (s.date.overlap.length === 0) {
            flowHintRef.current!.textContent =
              'Pick at least one overlap — that\'s your shared hook.';
            return false;
          }
          if (s.date.overlap.length > MAX_INTERESTS) {
            flowHintRef.current!.textContent = `Choose up to ${MAX_INTERESTS} overlaps.`;
            return false;
          }
          return true;
        case 8:
          return true;
        case 9:
          if (!s.date.goal) {
            flowHintRef.current!.textContent = 'Choose how you want the night to land.';
            return false;
          }
          return true;
        default:
          return true;
      }
    }

    function enforceCapsListeners(
      name: string,
      max: number,
      sig: AbortSignal
    ) {
      flowMountRef.current!.addEventListener(
        'change',
        (ev) => {
          const t = ev.target as HTMLInputElement;
          if (!(t instanceof HTMLInputElement)) return;
          if (t.name !== name || t.type !== 'checkbox') return;
          const checked = flowMountRef.current!.querySelectorAll(
            `input[name="${name}"]:checked`
          );
          if (checked.length > max) {
            t.checked = false;
            flowHintRef.current!.textContent = `Choose up to ${max}.`;
          } else {
            flowHintRef.current!.textContent = '';
          }
        },
        { signal: sig }
      );
    }

    function wireStepHandlers() {
      if (stepAbort) stepAbort.abort();
      stepAbort = new AbortController();
      const sig = stepAbort.signal;

      if (stepIndexRef.current === 1) {
        enforceCapsListeners('youInterests', MAX_INTERESTS, sig);
      }
      if (stepIndexRef.current === 6) {
        enforceCapsListeners('dateVibe', MAX_VIBE, sig);
      }
      if (stepIndexRef.current === 7) {
        enforceCapsListeners('dateOverlap', MAX_INTERESTS, sig);
      }

      flowMountRef.current!.addEventListener(
        'keydown',
        (e) => {
          const ke = e as KeyboardEvent;
          if (
            ke.key === 'Enter' &&
            e.target instanceof HTMLInputElement &&
            e.target.type === 'text'
          ) {
            e.preventDefault();
            btnFlowNextRef.current!.click();
          }
        },
        { signal: sig }
      );
    }

    function goNext() {
      collectFromDom();
      if (!validate()) return;
      if (stepIndexRef.current >= TOTAL_STEPS - 1) {
        finish();
        return;
      }
      stepIndexRef.current += 1;
      render();
    }

    function goBack() {
      collectFromDom();
      if (stepIndexRef.current === 0) {
        show(landingRef.current!);
        return;
      }
      stepIndexRef.current -= 1;
      render();
    }

    async function finish() {
      const s = stateRef.current;
      const name = s.you.name ? s.you.name : 'You';
      const bitsYou = mapInterests(s.you.interests);
      const tier = budgetCopy[s.you.budget] || 'something thoughtful';
      const bitsShared = mapInterests(s.date.overlap);
      const dateVibes = mapVibes(s.date.vibe);
      const stageLabel = stageLabels[s.date.stage] || 'a date with real potential';
      const goalLabel = goalLabels[s.date.goal] || 'good in your bodies and glad you came';

      const tags = mapDietTags(s.you.dietTags);
      const eatingClause = tags.length
        ? ` For you, food-wise: ${formatList(tags)}.`
        : '';

      const dateTags = mapDietTags(s.date.dietTags);
      const dateFoodClause = dateTags.length
        ? ` For your date (best guess): ${formatList(dateTags)}.`
        : '';

      outroSummaryRef.current!.textContent = `${name}, here's the read: this is ${stageLabel} with a ${tier} budget, your energy leans ${formatList(
        bitsYou
      )}, and your date is coming across ${formatList(
        dateVibes
      )}. You both light up around ${formatList(
        bitsShared
      )}, and the best version of the night ends with them feeling ${goalLabel}.${eatingClause}${dateFoodClause}`;

      outroIdeasRef.current!.innerHTML = renderIdeaCardsHtml([
        buildIdeaCard(
          'easy',
          'The easy opener',
          0,
          'Best when you want the night to feel natural fast, with enough structure to remove awkwardness without overproducing it.',
          s
        ),
        buildIdeaCard(
          'spark',
          'The shared spark',
          1,
          'Best when you want a little more momentum and chemistry, while still staying grounded in what you actually share.',
          s
        ),
        buildIdeaCard(
          'stretch',
          'The make-it-a-night version',
          2,
          'Best when you want the plan to feel more intentional and memorable, with room for the night to open up.',
          s
        ),
      ]);

      outroCityPlanRef.current!.innerHTML = '';
      show(outroRef.current!);

      // Check auth state — show save prompt if not signed in, or onboarding if planning_style not set
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const promptEl = document.getElementById('auth-save-prompt');
        if (promptEl) promptEl.style.display = 'block';
        document.getElementById('btn-auth-prompt')?.addEventListener('click', () => {
          setAuthModalOpen(true);
        });
      } else {
        // User is signed in — save display_name from step 1 and check onboarding
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const profile = await res.json();
            // Save the name they typed in step 1 if not already set
            const enteredName = s.you.name.trim();
            if (enteredName && !profile.display_name) {
              fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: enteredName }),
              }).catch(() => {});
            }
            if (!profile.planning_style) {
              setOnboardingOpen(true);
            }
          }
        } catch {
          // non-critical — silently skip on error
        }
      }
    }

    function resetStateOnly() {
      stateRef.current = {
        you: { name: '', interests: [], drinks: [], budget: '', dietTags: [] },
        date: { stage: '', vibe: [], overlap: [], dietTags: [], goal: '' },
      };
    }

    function resetAll() {
      stepIndexRef.current = 0;
      resetStateOnly();
      show(landingRef.current!);
    }

    function renderCityPlan(cityKey: string) {
      outroCityPlanRef.current!.innerHTML = renderCityPlanHtml(
        cityKey,
        stateRef.current
      );
      outroCityPlanRef.current!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // — wire up events —
    btnStartRef.current!.addEventListener('click', () => {
      stepIndexRef.current = 0;
      resetStateOnly();
      show(panelFlowRef.current!);
      render();
    });

    btnFlowExitRef.current!.addEventListener('click', () => {
      show(landingRef.current!);
    });

    btnFlowBackRef.current!.addEventListener('click', goBack);
    btnFlowNextRef.current!.addEventListener('click', goNext);

    btnOaklandRef.current!.addEventListener('click', () => renderCityPlan('oak'));
    btnSFRef.current!.addEventListener('click', () => renderCityPlan('sf'));

    btnRestartRef.current!.addEventListener('click', resetAll);
  }, []);

  return (
    <main id="main">
      {/* ——— Hero / landing ——— */}
      <section
        className="panel hero"
        id="step-landing"
        aria-labelledby="hero-title"
        ref={landingRef}
      >
        <div className="hero-copy">
          <p className="eyebrow">Be honest</p>
          <h1 id="hero-title">Most of us forgot how to date.</h1>
          <p className="lede">
            Between busy weeks and endless scrolling, planning something thoughtful
            fell off the list. That&#39;s human — not a character flaw.
          </p>
          <p className="lede strong">
            We&#39;re here to help you compose a night that fits <em>both</em> of you:
            one activity, one drink, one meal — anchored in what you actually share.
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="btn primary"
            id="btn-start"
            ref={btnStartRef}
          >
            Plan a night together
          </button>
          <p className="fine-print">
            A few playful questions, one at a time. First you, then your date.
          </p>
        </div>
      </section>

      {/* ——— Flow wizard ——— */}
      <section
        className="panel flow-panel hidden"
        id="panel-flow"
        aria-label="Date night planner questions"
        ref={panelFlowRef}
      >
        <div className="flow-toolbar">
          <button
            type="button"
            className="link-back"
            id="btn-flow-exit"
            ref={btnFlowExitRef}
          >
            ← Home
          </button>
          <div className="progress-wrap">
            <div
              className="progress-dots"
              id="progress-dots"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={1}
              aria-valuenow={1}
              aria-label="Question progress"
              ref={progressDotsRef}
            ></div>
            <span
              className="progress-label"
              id="progress-label"
              ref={progressLabelRef}
            >
              1 / 1
            </span>
          </div>
          <span className="phase-tag" id="phase-tag" ref={phaseTagRef}>
            You
          </span>
        </div>

        <div className="flow-card" id="flow-card">
          <div
            className="flow-step-inner pop-in"
            id="flow-mount"
            ref={flowMountRef}
          ></div>
        </div>

        <p
          className="flow-hint"
          id="flow-hint"
          aria-live="polite"
          ref={flowHintRef}
        ></p>

        <div className="flow-nav">
          <button
            type="button"
            className="btn ghost"
            id="btn-flow-back"
            ref={btnFlowBackRef}
          >
            Back
          </button>
          <button
            type="button"
            className="btn primary"
            id="btn-flow-next"
            ref={btnFlowNextRef}
          >
            Next
          </button>
        </div>
      </section>

      {/* ——— Outro ——— */}
      <section
        className="panel outro hidden"
        id="step-outro"
        aria-labelledby="outro-title"
        ref={outroRef}
      >
        <p className="eyebrow">Recipe incoming</p>
        <h2 id="outro-title">You did the hard part: showing up with intention.</h2>
        <p className="lede" id="outro-summary" ref={outroSummaryRef}></p>
        <div id="auth-save-prompt" style={{ display: 'none', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--accent)', cursor: 'pointer', margin: 0 }} id="btn-auth-prompt">
            Sign in to save this plan →
          </p>
        </div>
        <div
          className="outro-ideas"
          id="outro-ideas"
          aria-label="Three date ideas"
          ref={outroIdeasRef}
        ></div>
        <div className="city-plan-prompt">
          <p className="city-plan-label">Want real venues near you?</p>
          <div className="city-plan-btns">
            <button
              type="button"
              className="btn secondary"
              id="btn-oakland"
              ref={btnOaklandRef}
            >
              Oakland Plan
            </button>
            <button
              type="button"
              className="btn secondary"
              id="btn-sf"
              ref={btnSFRef}
            >
              San Francisco Plan
            </button>
          </div>
        </div>
        <div
          id="outro-city-plan"
          className="outro-city-plan"
          ref={outroCityPlanRef}
        ></div>
        <button
          type="button"
          className="btn primary"
          id="btn-restart"
          ref={btnRestartRef}
        >
          Start over
        </button>
      </section>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </main>
  );
}
