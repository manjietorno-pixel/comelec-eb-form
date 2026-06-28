import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  DESIGNATIONS,
  DEPED_STATUS,
  TEACHING_STATUS,
  GENDER,
  SECTIONS,
  INITIAL_FORM,
} from './constants';
import { formatTIN, validateField, REQUIRED_FIELDS } from './utils';
import './form.css';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const FIELD_SECTION_MAP = {
  firstName: 'personal',
  middleName: 'personal',
  lastName: 'personal',
  gender: 'personal',
  birthdate: 'personal',
  depedStatus: 'employment',
  designation: 'employment',
  teachingStatus: 'employment',
  salaryGrade: 'employment',
  tin: 'employment',
  contactNumber: 'contact',
  altContactNumber: 'contact',
  email: 'contact',
  address: 'contact',
  votingBarangay: 'voter',
  precinctNumber: 'voter',
  electionExperience: 'experience',
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('');

  const currentSection = SECTIONS[step];

  const sectionFields = useMemo(
    () =>
      Object.keys(FIELD_SECTION_MAP).filter(
        (f) => FIELD_SECTION_MAP[f] === currentSection.id
      ),
    [currentSection]
  );

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors((e) => ({ ...e, [name]: validateField(name, value, form) }));
    }
  }

  function handleBlur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, form[name], form) }));
  }

  function validateSection() {
    const newErrors = {};
    let valid = true;
    sectionFields.forEach((name) => {
      if (!REQUIRED_FIELDS.includes(name)) return;
      const err = validateField(name, form[name], form);
      if (err) {
        newErrors[name] = err;
        valid = false;
      }
    });
    setErrors((e) => ({ ...e, ...newErrors }));
    setTouched((t) => {
      const next = { ...t };
      sectionFields.forEach((name) => {
        next[name] = true;
      });
      return next;
    });
    return valid;
  }

  function goNext() {
    if (!validateSection()) return;
    setStep((s) => Math.min(s + 1, SECTIONS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateSection()) return;

    setStatus('submitting');
    setSubmitError('');

    try {
      if (!SCRIPT_URL) {
        throw new Error('Form endpoint is not configured yet.');
      }
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.result === 'duplicate') {
        setStatus('idle');
        setErrors((e) => ({
          ...e,
          tin: 'This TIN has already been submitted.',
        }));
        setStep(SECTIONS.findIndex((s) => s.id === 'employment'));
        return;
      }
      if (data.result !== 'success') {
        throw new Error(data.message || 'Submission failed.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="page">
        <div className="card success-card">
          <CheckCircle2
            size={48}
            strokeWidth={1.5}
            color="var(--success-line)"
          />
          <h2>Submission received</h2>
          <p>
            Thank you, {form.firstName}. Your Electoral Board profile has been
            recorded by the Office of the Election Officer, Kawit, Cavite.
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setForm(INITIAL_FORM);
              setStep(0);
              setTouched({});
              setErrors({});
              setStatus('idle');
            }}
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="masthead">
        <ShieldCheck size={28} strokeWidth={1.5} />
        <div>
          <p className="eyebrow">
            Commission on Elections &middot; Office of the Election Officer
          </p>
          <h1>Basic Profile for the Electoral Boards</h1>
        </div>
      </header>

      <p className="intro">
        This form is for teachers and personnel who will serve as Electoral
        Board members in the upcoming elections, Kawit, Cavite. Information
        collected here is used solely to prepare the Electoral Board list and
        finalize the office payroll, and is handled in accordance with the Data
        Privacy Act.
      </p>

      <ol className="progress" aria-label="Form progress">
        {SECTIONS.map((s, i) => (
          <li
            key={s.id}
            className={i === step ? 'active' : i < step ? 'done' : ''}
          >
            <span className="dot" />
            <span className="step-label">{s.label}</span>
          </li>
        ))}
      </ol>

      <form
        className="card"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        <h2 className="section-title">{currentSection.label}</h2>

        {currentSection.id === 'personal' && (
          <>
            <Row>
              <Field label="First name" required error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                />
              </Field>
              <Field label="Middle name" hint="Full name, not initials">
                <input
                  value={form.middleName}
                  onChange={(e) => updateField('middleName', e.target.value)}
                  onBlur={() => handleBlur('middleName')}
                />
              </Field>
              <Field label="Last name" required error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                />
              </Field>
            </Row>
            <Row>
              <Field label="Gender" required error={errors.gender}>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  onBlur={() => handleBlur('gender')}
                >
                  <option value="">Select</option>
                  {GENDER.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Birthdate" required error={errors.birthdate}>
                <input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => updateField('birthdate', e.target.value)}
                  onBlur={() => handleBlur('birthdate')}
                />
              </Field>
            </Row>
          </>
        )}

        {currentSection.id === 'employment' && (
          <>
            <Row>
              <Field
                label="TIN number"
                required
                error={errors.tin}
                hint="Format: 123-456-789"
              >
                <input
                  value={form.tin}
                  onChange={(e) =>
                    updateField('tin', formatTIN(e.target.value))
                  }
                  onBlur={() => handleBlur('tin')}
                  inputMode="numeric"
                  placeholder="123-456-789"
                />
              </Field>
              <Field
                label="DepEd / Non-DepEd"
                required
                error={errors.depedStatus}
              >
                <select
                  value={form.depedStatus}
                  onChange={(e) => updateField('depedStatus', e.target.value)}
                  onBlur={() => handleBlur('depedStatus')}
                >
                  <option value="">Select</option>
                  {DEPED_STATUS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
            <Row>
              <Field label="Designation" required error={errors.designation}>
                <select
                  value={form.designation}
                  onChange={(e) => updateField('designation', e.target.value)}
                  onBlur={() => handleBlur('designation')}
                >
                  <option value="">Select</option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Teaching / Non-Teaching"
                required
                error={errors.teachingStatus}
              >
                <select
                  value={form.teachingStatus}
                  onChange={(e) =>
                    updateField('teachingStatus', e.target.value)
                  }
                  onBlur={() => handleBlur('teachingStatus')}
                >
                  <option value="">Select</option>
                  {TEACHING_STATUS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
            <Row>
              <Field
                label="Salary grade or monthly salary"
                required
                error={errors.salaryGrade}
                hint="e.g. 13, or estimated monthly salary"
              >
                <input
                  value={form.salaryGrade}
                  onChange={(e) => updateField('salaryGrade', e.target.value)}
                  onBlur={() => handleBlur('salaryGrade')}
                />
              </Field>
            </Row>
          </>
        )}

        {currentSection.id === 'contact' && (
          <>
            <Row>
              <Field
                label="Active contact number"
                required
                error={errors.contactNumber}
                hint="e.g. 09171234567"
              >
                <input
                  value={form.contactNumber}
                  onChange={(e) => updateField('contactNumber', e.target.value)}
                  onBlur={() => handleBlur('contactNumber')}
                  inputMode="tel"
                />
              </Field>
              <Field
                label="Alternate contact number"
                error={errors.altContactNumber}
              >
                <input
                  value={form.altContactNumber}
                  onChange={(e) =>
                    updateField('altContactNumber', e.target.value)
                  }
                  onBlur={() => handleBlur('altContactNumber')}
                  inputMode="tel"
                />
              </Field>
            </Row>
            <Row>
              <Field label="Active email address" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
              </Field>
            </Row>
            <Row>
              <Field
                label="Address"
                required
                error={errors.address}
                hint="Barangay and city/municipality"
              >
                <input
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                />
              </Field>
            </Row>
          </>
        )}

        {currentSection.id === 'voter' && (
          <Row>
            <Field
              label="Registered voter barangay & municipality"
              required
              error={errors.votingBarangay}
              hint="e.g. Toclong, Kawit"
            >
              <input
                value={form.votingBarangay}
                onChange={(e) => updateField('votingBarangay', e.target.value)}
                onBlur={() => handleBlur('votingBarangay')}
              />
            </Field>
            <Field
              label="Precinct number"
              required
              error={errors.precinctNumber}
            >
              <input
                value={form.precinctNumber}
                onChange={(e) => updateField('precinctNumber', e.target.value)}
                onBlur={() => handleBlur('precinctNumber')}
              />
            </Field>
          </Row>
        )}

        {currentSection.id === 'experience' && (
          <Row>
            <Field
              label="Election duty experience"
              hint="e.g. May 2025 NLE - Chairman; December 2023 BSKE - Poll Clerk"
            >
              <textarea
                rows={4}
                value={form.electionExperience}
                onChange={(e) =>
                  updateField('electionExperience', e.target.value)
                }
                onBlur={() => handleBlur('electionExperience')}
              />
            </Field>
          </Row>
        )}

        {status === 'error' && (
          <div className="banner error">
            <AlertCircle size={18} />
            <span>{submitError}</span>
          </div>
        )}

        <div className="actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={goBack}
            disabled={step === 0 || status === 'submitting'}
          >
            <ChevronLeft size={18} /> Back
          </button>
          {step < SECTIONS.length - 1 ? (
            <button
              key="next-btn"
              type="button"
              className="btn-primary"
              onClick={goNext}
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button
              key="submit-btn"
              type="submit"
              className="btn-primary"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={18} className="spin" /> Submitting&hellip;
                </>
              ) : (
                'Submit profile'
              )}
            </button>
          )}
        </div>
      </form>

      <p className="footnote">
        All personal information shared is treated with confidentiality in
        compliance with the Data Privacy Act of 2012.
      </p>
    </div>
  );
}

function Row({ children }) {
  return <div className="row">{children}</div>;
}

function Field({ label, required, error, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="req">*</span>}
      </span>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
