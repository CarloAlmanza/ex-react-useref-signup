import { useState, useRef, useEffect } from 'react';
import './RegistrationForm.css';

const SPECIALIZATIONS = ['Full Stack', 'Frontend', 'Backend'];

const letters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";

const hasCharFrom = (str, set) =>
    [...str.toLowerCase()].some((ch) => set.includes(ch));

const validateFullName = (value) =>
    value.trim() ? '' : 'Il nome completo è obbligatorio';

const validateUsername = (value) => {
    if (!value) return 'Username obbligatorio';
    if (value.length < 6) return 'Minimo 6 caratteri';
    const allowed = letters + numbers;
    const invalid = [...value.toLowerCase()].some((ch) => !allowed.includes(ch));
    if (invalid) return 'Solo lettere e numeri (no spazi o simboli)';
    return '';
};

const validatePassword = (value) => {
    if (!value) return 'Password obbligatoria';
    if (value.length < 8) return 'Minimo 8 caratteri';
    if (!hasCharFrom(value, letters)) return 'Deve contenere almeno 1 lettera';
    if (!hasCharFrom(value, numbers)) return 'Deve contenere almeno 1 numero';
    if (!hasCharFrom(value, symbols)) return 'Deve contenere almeno 1 simbolo';
    return '';
};

const validateSpecialization = (value) =>
    value ? '' : 'Seleziona una specializzazione';

const validateYears = (value) => {
    if (value === '') return 'Campo obbligatorio';
    if (Number(value) <= 0) return 'Inserisci un numero positivo';
    return '';
};

const validateDescription = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Descrizione obbligatoria';
    if (trimmed.length < 100) return `Minimo 100 caratteri (attuali: ${trimmed.length})`;
    if (trimmed.length > 1000) return `Massimo 1000 caratteri (attuali: ${trimmed.length})`;
    return '';
};

const INITIAL_CONTROLLED = {
    username: '',
    password: '',
    description: '',
};

export default function RegistrationForm() {
    const [controlled, setControlled] = useState(INITIAL_CONTROLLED);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    // Ref per i campi non controllati
    const fullNameRef = useRef(null);
    const specializationRef = useRef(null);
    const yearsRef = useRef(null);

    // Ref al contenitore del form (per lo scroll-to-top)
    const formTopRef = useRef(null);

    // Focus automatico sul primo input al mount
    useEffect(() => {
        fullNameRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setControlled((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const getLiveError = (name) => {
        if (!touched[name]) return '';
        switch (name) {
            case 'username': return validateUsername(controlled.username);
            case 'password': return validatePassword(controlled.password);
            case 'description': return validateDescription(controlled.description);
            default: return '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formValues = {
            fullName: fullNameRef.current.value,
            username: controlled.username,
            password: controlled.password,
            specialization: specializationRef.current.value,
            yearsOfExperience: yearsRef.current.value,
            description: controlled.description,
        };

        const validationErrors = {
            fullName: validateFullName(formValues.fullName),
            username: validateUsername(formValues.username),
            password: validatePassword(formValues.password),
            specialization: validateSpecialization(formValues.specialization),
            yearsOfExperience: validateYears(formValues.yearsOfExperience),
            description: validateDescription(formValues.description),
        };

        const cleanedErrors = Object.fromEntries(
            Object.entries(validationErrors).filter(([, msg]) => msg)
        );

        setErrors(cleanedErrors);
        setTouched({ username: true, password: true, description: true });

        if (Object.keys(cleanedErrors).length > 0) return;

        console.log('Dati del form:', formValues);
    };

    // Reset completo: state + ref + errori + focus
    const handleReset = () => {
        // 1. Reset campi controllati
        setControlled(INITIAL_CONTROLLED);
        setErrors({});
        setTouched({});

        // 2. Reset manuale campi non controllati tramite ref
        if (fullNameRef.current) fullNameRef.current.value = '';
        if (specializationRef.current) specializationRef.current.value = '';
        if (yearsRef.current) yearsRef.current.value = '';

        // 3. Riporta il focus al primo campo
        fullNameRef.current?.focus();
    };

    // Scroll fluido all'inizio del form
    const scrollToTop = () => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderLiveFeedback = (name) => {
        if (!touched[name]) return null;
        const error = getLiveError(name);
        if (error) return <span className="error">{error}</span>;
        return <span className="success">✓ Valido</span>;
    };

    return (
        <>
            {/* Contenitore principale con ref per scroll */}
            <form
                className="reg-form"
                onSubmit={handleSubmit}
                noValidate
                ref={formTopRef}
            >
                <h2>Registrazione Sviluppatore</h2>

                {/* Nome completo — NON controllato + autofocus */}
                <div className="field">
                    <label htmlFor="fullName">Nome completo *</label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        ref={fullNameRef}
                        defaultValue=""
                        placeholder="Mario Rossi"
                    />
                    {errors.fullName && <span className="error">{errors.fullName}</span>}
                </div>

                {/* Username — CONTROLLATO */}
                <div className="field">
                    <label htmlFor="username">Username *</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={controlled.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="dev_mario"
                    />
                    {renderLiveFeedback('username')}
                    {!touched.username && errors.username && (
                        <span className="error">{errors.username}</span>
                    )}
                </div>

                {/* Password — CONTROLLATO */}
                <div className="field">
                    <label htmlFor="password">Password *</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={controlled.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                    />
                    {renderLiveFeedback('password')}
                    {!touched.password && errors.password && (
                        <span className="error">{errors.password}</span>
                    )}
                </div>

                {/* Specializzazione — NON controllato */}
                <div className="field">
                    <label htmlFor="specialization">Specializzazione *</label>
                    <select
                        id="specialization"
                        name="specialization"
                        ref={specializationRef}
                        defaultValue=""
                    >
                        <option value="">-- Seleziona --</option>
                        {SPECIALIZATIONS.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    {errors.specialization && <span className="error">{errors.specialization}</span>}
                </div>

                {/* Anni di esperienza — NON controllato */}
                <div className="field">
                    <label htmlFor="yearsOfExperience">Anni di esperienza *</label>
                    <input
                        id="yearsOfExperience"
                        type="number"
                        name="yearsOfExperience"
                        ref={yearsRef}
                        defaultValue=""
                        min="0"
                        placeholder="es. 3"
                    />
                    {errors.yearsOfExperience && (
                        <span className="error">{errors.yearsOfExperience}</span>
                    )}
                </div>

                {/* Descrizione — CONTROLLATO */}
                <div className="field">
                    <label htmlFor="description">Breve descrizione *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={controlled.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows="4"
                        placeholder="Raccontaci di te come sviluppatore..."
                    />
                    <small className="counter">
                        {controlled.description.trim().length} / 1000 caratteri (min. 100)
                    </small>
                    {renderLiveFeedback('description')}
                    {!touched.description && errors.description && (
                        <span className="error">{errors.description}</span>
                    )}
                </div>

                <div className="actions">
                    <button type="submit" className="btn-primary">Registrati</button>
                    <button type="button" className="btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            {/*Freccia fissa in basso a destra */}
            <button
                type="button"
                className="scroll-top-btn"
                onClick={scrollToTop}
                aria-label="Torna all'inizio del form"
                title="Torna in alto"
            >
                ▲
            </button>
        </>
    );
}