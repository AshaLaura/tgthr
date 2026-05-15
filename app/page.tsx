'use client';

import { useRef, useEffect, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import OnboardingModal from '@/components/OnboardingModal';
import { createBrowserClient } from '@/lib/supabase';
import {
  State,
  IdeaCard,
  STEP_PHASES,
  MAX_INTERESTS,
  MAX_VIBE,
  renderStepContent,
  renderIdeaCardsHtml,
  buildThreeCards,
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
  const outroIdeasRef = useRef<HTMLDivElement>(null);
  const btnRestartRef = useRef<HTMLButtonElement>(null);

  // — questionnaire state (imperative, not React state) —
  const stateRef = useRef<State>({
    profile:  { name: '', dietTags: [], dietNotes: '', drinks: [] },
    occasion: { occasionType: '', personName: '', interests: [], personDietTags: [], personDietNotes: '', personDrinks: [], stage: '', vibe: [], goal: '' },
  });
  const stepIndexRef = useRef(0);
  const cardsRef = useRef<IdeaCard[]>([]);

  useEffect(() => {
    const TOTAL_STEPS = STEP_PHASES.length;
    let stepAbort: AbortController | null = null;
    // Steps to skip when user is already logged in (0=name, 2=your diet, 3=your drinks).
    // Values are pre-filled from profile instead.
    let skippedSteps: Set<number> = new Set();

    function firstVisibleStep(): number {
      for (let i = 0; i < TOTAL_STEPS; i++) {
        if (!skippedSteps.has(i)) return i;
      }
      return 0;
    }

    function nextVisibleStep(from: number): number {
      let n = from + 1;
      while (n < TOTAL_STEPS && skippedSteps.has(n)) n++;
      return n;
    }

    function prevVisibleStep(from: number): number {
      let p = from - 1;
      while (p >= 0 && skippedSteps.has(p)) p--;
      return p;
    }

    /** 0-based position of `step` among visible (non-skipped) steps. */
    function visibleIndex(step: number): number {
      let count = 0;
      for (let i = 0; i < step; i++) {
        if (!skippedSteps.has(i)) count++;
      }
      return count;
    }

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
      phaseTagRef.current!.textContent = phase === 'profile' ? 'Your Profile' : 'Your Occasion';

      const effectiveStep  = visibleIndex(stepIndexRef.current);
      const effectiveTotal = TOTAL_STEPS - skippedSteps.size;
      progressLabelRef.current!.textContent = `${effectiveStep + 1} / ${effectiveTotal}`;
      progressDotsRef.current!.innerHTML = '';
      for (let i = 0; i < effectiveTotal; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i < effectiveStep) dot.classList.add('is-done');
        if (i === effectiveStep) dot.classList.add('is-active');
        dot.setAttribute('aria-hidden', 'true');
        progressDotsRef.current!.appendChild(dot);
      }
      progressDotsRef.current!.setAttribute('aria-valuemax', String(effectiveTotal));
      progressDotsRef.current!.setAttribute('aria-valuenow', String(effectiveStep + 1));

      const isLast = nextVisibleStep(stepIndexRef.current) >= TOTAL_STEPS;
      btnFlowNextRef.current!.textContent = isLast ? 'Build my night →' : 'Next';

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
          s.profile.name = ((root.querySelector('#fld-name') as HTMLInputElement)?.value || '').trim();
          break;
        case 1:
          s.profile.dietTags  = readChecked(root, 'dietPref');
          s.profile.dietNotes = ((root.querySelector('#fld-diet-notes') as HTMLInputElement)?.value || '').trim();
          break;
        case 2:
          s.profile.drinks = readChecked(root, 'youDrinks');
          break;
        case 3: {
          const ot = root.querySelector<HTMLInputElement>('input[name="occasionType"]:checked');
          s.occasion.occasionType = ot ? ot.value : '';
          s.occasion.personName = ((root.querySelector('#fld-person-name') as HTMLInputElement)?.value || '').trim();
          break;
        }
        case 4:
          s.occasion.interests = readChecked(root, 'theirInterests');
          break;
        case 5:
          s.occasion.personDietTags  = readChecked(root, 'personDietPref');
          s.occasion.personDietNotes = ((root.querySelector('#fld-person-diet-notes') as HTMLInputElement)?.value || '').trim();
          break;
        case 6:
          s.occasion.personDrinks = readChecked(root, 'theirDrinks');
          break;
        case 7: {
          const st = root.querySelector<HTMLInputElement>('input[name="stage"]:checked');
          s.occasion.stage = st ? st.value : '';
          break;
        }
        case 8:
          s.occasion.vibe = readChecked(root, 'personVibe');
          break;
        case 9: {
          const g = root.querySelector<HTMLInputElement>('input[name="dateGoal"]:checked');
          s.occasion.goal = g ? g.value : '';
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
          return true;
        case 2:
          if (s.profile.drinks.length === 0) {
            flowHintRef.current!.textContent = "Pick at least one — we'll shape a stop around it.";
            return false;
          }
          return true;
        case 3:
          if (!s.occasion.occasionType) {
            flowHintRef.current!.textContent = 'Pick who the night is for.';
            return false;
          }
          return true;
        case 4:
          if (s.occasion.interests.length === 0) {
            flowHintRef.current!.textContent = "Pick at least one — or we're guessing blind.";
            return false;
          }
          if (s.occasion.interests.length > MAX_INTERESTS) {
            flowHintRef.current!.textContent = `Choose up to ${MAX_INTERESTS} interests.`;
            return false;
          }
          return true;
        case 5:
          return true;
        case 6:
          if (s.occasion.personDrinks.length === 0) {
            flowHintRef.current!.textContent = "Pick at least one — we'll shape a stop around it.";
            return false;
          }
          return true;
        case 7:
          if (!s.occasion.stage) {
            flowHintRef.current!.textContent = "Tell us where you're at — we'll tune the stakes.";
            return false;
          }
          return true;
        case 8:
          if (s.occasion.vibe.length === 0) {
            flowHintRef.current!.textContent = 'Pick at least one vibe.';
            return false;
          }
          if (s.occasion.vibe.length > MAX_VIBE) {
            flowHintRef.current!.textContent = `Up to ${MAX_VIBE} vibes, please.`;
            return false;
          }
          return true;
        case 9:
          if (!s.occasion.goal) {
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

      if (stepIndexRef.current === 4) {
        enforceCapsListeners('theirInterests', MAX_INTERESTS, sig);
      }
      if (stepIndexRef.current === 8) {
        enforceCapsListeners('personVibe', MAX_VIBE, sig);
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
      const next = nextVisibleStep(stepIndexRef.current);
      if (next >= TOTAL_STEPS) {
        finish();
        return;
      }
      stepIndexRef.current = next;
      render();
    }

    function goBack() {
      collectFromDom();
      const prev = prevVisibleStep(stepIndexRef.current);
      if (prev < firstVisibleStep()) {
        show(landingRef.current!);
        return;
      }
      stepIndexRef.current = prev;
      render();
    }

    async function finish() {
      const s = stateRef.current;
      const cards = buildThreeCards(s);
      cardsRef.current = cards;
      outroIdeasRef.current!.innerHTML = renderIdeaCardsHtml(cards);
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
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const profile = await res.json();
            const enteredName = s.profile.name.trim();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const prefUpdates: Record<string, any> = {
              drinks:    s.profile.drinks,
              diet_tags: s.profile.dietTags,
            };
            if (enteredName && enteredName !== profile.display_name) {
              prefUpdates.display_name = enteredName;
            }
            fetch('/api/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(prefUpdates),
            }).catch(() => {});
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
        profile:  { name: '', dietTags: [], dietNotes: '', drinks: [] },
        occasion: { occasionType: '', personName: '', interests: [], personDietTags: [], personDietNotes: '', personDrinks: [], stage: '', vibe: [], goal: '' },
      };
    }

    function resetAll() {
      skippedSteps = new Set();
      stepIndexRef.current = 0;
      resetStateOnly();
      outroIdeasRef.current!.style.display = '';
      show(landingRef.current!);
    }

    // — wire up events —
    btnStartRef.current!.addEventListener('click', async () => {
      resetStateOnly();
      show(panelFlowRef.current!);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Logged in — skip profile steps (0, 1, 2); pre-fill from saved profile
        skippedSteps = new Set([0, 1, 2]);
        stepIndexRef.current = firstVisibleStep();
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const profile = await res.json();
            if (profile.display_name) stateRef.current.profile.name     = profile.display_name;
            if (profile.diet_tags?.length) stateRef.current.profile.dietTags = profile.diet_tags;
            if (profile.drinks?.length)    stateRef.current.profile.drinks   = profile.drinks;
          }
        } catch {
          // non-critical
        }
      } else {
        skippedSteps = new Set();
        stepIndexRef.current = 0;
      }

      render();
    });

    btnFlowExitRef.current!.addEventListener('click', () => {
      show(landingRef.current!);
    });

    btnFlowBackRef.current!.addEventListener('click', goBack);
    btnFlowNextRef.current!.addEventListener('click', goNext);

    // Delegated handler for idea cards — save button on each card
    outroRef.current!.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;

      const savePlanBtn = target.closest('.city-plan-save') as HTMLElement | null;
      if (savePlanBtn) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setAuthModalOpen(true); return; }

        const cityToSave = savePlanBtn.dataset.city!;
        const ideaIdx = parseInt(savePlanBtn.dataset.ideaIndex ?? '0', 10);
        const card = cardsRef.current[ideaIdx];

        savePlanBtn.textContent = 'Saving…';
        savePlanBtn.setAttribute('disabled', 'true');
        try {
          await fetch('/api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionnaire_data: stateRef.current,
              plan_output: [card],
              city: cityToSave,
            }),
          });
          savePlanBtn.textContent = 'Saved ✓';
          savePlanBtn.classList.add('is-saved');
        } catch {
          savePlanBtn.textContent = 'Save this plan';
          savePlanBtn.removeAttribute('disabled');
        }
        return;
      }
    });

    btnRestartRef.current!.addEventListener('click', resetAll);

    // — save + restore state across auth redirect —

    function saveStateForRestore() {
      const panel = !outroRef.current!.classList.contains('hidden') ? 'outro'
        : !panelFlowRef.current!.classList.contains('hidden') ? 'flow'
        : 'landing';
      if (panel === 'landing') return;
      sessionStorage.setItem('tgthr_restore', JSON.stringify({
        panel,
        state:     stateRef.current,
        stepIndex: stepIndexRef.current,
      }));
    }
    window.addEventListener('tgthr:before-signin', saveStateForRestore);

    // On mount: if we have saved state and user just came back from auth, restore it
    const savedRestore = sessionStorage.getItem('tgthr_restore');
    if (savedRestore) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        try {
          const { panel, state: savedState, stepIndex } = JSON.parse(savedRestore);
          sessionStorage.removeItem('tgthr_restore');
          stateRef.current = savedState;
          if (panel === 'outro') {
            await finish();
          } else if (panel === 'flow') {
            stepIndexRef.current = stepIndex ?? 0;
            show(panelFlowRef.current!);
            render();
          }
        } catch {
          sessionStorage.removeItem('tgthr_restore');
        }
      });
    }

    return () => {
      window.removeEventListener('tgthr:before-signin', saveStateForRestore);
    };
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
          <div className="cta-inner">
            <button
              type="button"
              className="btn ghost"
              id="btn-flow-back"
              ref={btnFlowBackRef}
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#a89bb8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
        </div>
      </section>

      {/* ——— Outro ——— */}
      <section
        className="panel outro hidden"
        id="step-outro"
        aria-labelledby="outro-title"
        ref={outroRef}
      >
        <p className="eyebrow">Here&apos;s your night</p>
        <h2 id="outro-title">Three ways to make it happen.</h2>
        <div id="auth-save-prompt" style={{ display: 'none', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--accent)', cursor: 'pointer', margin: 0 }} id="btn-auth-prompt">
            Sign in to save this plan →
          </p>
        </div>
        <div
          className="outro-ideas"
          id="outro-ideas"
          aria-label="Three date night plans"
          ref={outroIdeasRef}
        ></div>
        <button
          type="button"
          className="btn primary"
          id="btn-restart"
          ref={btnRestartRef}
          style={{ marginTop: '1.5rem' }}
        >
          Start over
        </button>
      </section>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </main>
  );
}
