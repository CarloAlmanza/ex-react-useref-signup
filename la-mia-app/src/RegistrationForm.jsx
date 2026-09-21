import { useState } from 'react';
import './RegistrationForm.css';

const SPECIALIZATIONS = ['Full Stack', 'Frontend', 'Backend'];

// Caratteri validi (dal suggerimento)
const letters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";

// Controlla se una stringa contiene almeno un carattere di una categoria
const hasCharFrom = (str, set) =>
    [...str.toLowerCase()].some((ch) => set.includes(ch));

// --- Regole di validazione live ---
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

const validateDescription = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Descrizione obbligatoria';
    if (trimmed.length < 100) return `Minimo 100 caratteri (attuali: ${trimmed.length})`;
    if (trimmed.length > 1000) return `Massimo 1000 caratteri (attuali: ${trimmed.length})`;
    return '';
};

const INITIAL_FORM = {
    fullName: '',
    username: '',
    password: '',
    specialization: '',
    yearsOfExperience: '',
    description: '',
};

export default function RegistrationForm() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Handler generico
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al blur (uscita dal campo) attivo la validazione live
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    // Calcola l'errore di un campo "live" solo dopo che è stato toccato
    const getLiveError = (name) => {
        if (!touched[name]) return '';
        switch (name) {
            case 'username': return validateUsername(formData.username);
            case 'password': return validatePassword(formData.password);
            case 'description': return validateDescription(formData.description);
            default: return '';
        }
    };

    // Validazione completa al submit (tutti i campi)
    const validateAll = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Il nome completo è obbligatorio';
        if (!formData.username.trim()) newErrors.username = 'Lo username è obbligatorio';
        else {
            const e = validateUsername(formData.username);
            if (e) newErrors.username = e;
        }
        if (!formData.password) newErrors.password = 'La password è obbligatoria';
        else {
            const e = validatePassword(formData.password);
            if (e) newErrors.password = e;
        }
        if (!formData.specialization) newErrors.specialization = 'Seleziona una specializzazione';
        if (formData.yearsOfExperience === '') newErrors.yearsOfExperience = 'Campo obbligatorio';
        else if (Number(formData.yearsOfExperience) <= 0)
            newErrors.yearsOfExperience = 'Inserisci un numero positivo';
        if (!formData.description.trim()) newErrors.description = 'La descrizione è obbligatoria';
        else {
            const e = validateDescription(formData.description);
            if (e) newErrors.description = e;
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateAll();
        setErrors(validationErrors);

        // Segna tutti i campi come "toccati" così gli errori live appaiono
        setTouched({
            username: true,
            password: true,
            description: true,
        });

        if (Object.keys(validationErrors).length > 0) return;

        console.log('Dati del form:', formData);
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM);
        setErrors({});
        setTouched({});
    };

    // Helper per rendere il messaggio live (errore rosso o conferma verde)
    const renderLiveFeedback = (name) => {
        if (!touched[name]) return null;
        const error = getLiveError(name);
        if (error) return <span className="error">{error}</span>;
        return <span className="success">✓ Valido</span>;
    };

    return (
        <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <h2>Registrazione Sviluppatore</h2>

            {/* Nome completo */}
            <div className="field">
                <label htmlFor="fullName">Nome completo *</label>
                <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Mario Rossi"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            {/* Username con validazione live */}
            <div className="field">
                <label htmlFor="username">Username *</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="dev_mario"
                />
                {renderLiveFeedback('username')}
                {!touched.username && errors.username && (
                    <span className="error">{errors.username}</span>
                )}
            </div>

            {/* Password con validazione live */}
            <div className="field">
                <label htmlFor="password">Password *</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                />
                {renderLiveFeedback('password')}
                {!touched.password && errors.password && (
                    <span className="error">{errors.password}</span>
                )}
            </div>

            {/* Specializzazione */}
            <div className="field">
                <label htmlFor="specialization">Specializzazione *</label>
                <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                >
                    <option value="">-- Seleziona --</option>
                    {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
                {errors.specialization && <span className="error">{errors.specialization}</span>}
            </div>

            {/* Anni di esperienza */}
            <div className="field">
                <label htmlFor="yearsOfExperience">Anni di esperienza *</label>
                <input
                    id="yearsOfExperience"
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    placeholder="es. 3"
                />
                {errors.yearsOfExperience && <span className="error">{errors.yearsOfExperience}</span>}
            </div>

            {/* Descrizione con validazione live */}
            <div className="field">
                <label htmlFor="description">Breve descrizione *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="4"
                    placeholder="Raccontaci di te come sviluppatore..."
                />
                <small className="counter">
                    {formData.description.trim().length} / 1000 caratteri (min. 100)
                </small>
                {renderLiveFeedback('description')}
                {!touched.description && errors.description && (
                    <span className="error">{errors.description}</span>
                )}
            </div>

            <div className="actions">
                <button type="submit" className="btn-primary">Registrati</button>
                <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}