import { useState } from 'react';
import './RegistrationForm.css';

const SPECIALIZATIONS = ['Full Stack', 'Frontend', 'Backend'];

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

    // Handler generico per tutti i campi controllati
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Rimuove l'errore del campo mentre l'utente lo corregge
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Validazione al submit
    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Il nome completo è obbligatorio';
        }
        if (!formData.username.trim()) {
            newErrors.username = 'Lo username è obbligatorio';
        }
        if (!formData.password) {
            newErrors.password = 'La password è obbligatoria';
        }
        if (!formData.specialization) {
            newErrors.specialization = 'Seleziona una specializzazione';
        }
        if (formData.yearsOfExperience === '') {
            newErrors.yearsOfExperience = 'Gli anni di esperienza sono obbligatori';
        } else if (Number(formData.yearsOfExperience) <= 0) {
            newErrors.yearsOfExperience = 'Inserisci un numero positivo';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'La descrizione è obbligatoria';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return; // Il form non è valido
        }

        // ✅ Form valido → stampa i dati in console
        console.log('Dati del form:', formData);
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM);
        setErrors({});
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

            {/* Username */}
            <div className="field">
                <label htmlFor="username">Username *</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="dev_mario"
                />
                {errors.username && <span className="error">{errors.username}</span>}
            </div>

            {/* Password */}
            <div className="field">
                <label htmlFor="password">Password *</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />
                {errors.password && <span className="error">{errors.password}</span>}
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
                        <option key={spec} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>
                {errors.specialization && (
                    <span className="error">{errors.specialization}</span>
                )}
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
                {errors.yearsOfExperience && (
                    <span className="error">{errors.yearsOfExperience}</span>
                )}
            </div>

            {/* Descrizione */}
            <div className="field">
                <label htmlFor="description">Breve descrizione *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Raccontaci di te come sviluppatore..."
                />
                {errors.description && (
                    <span className="error">{errors.description}</span>
                )}
            </div>

            <div className="actions">
                <button type="submit" className="btn-primary">
                    Registrati
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </form>
    );
}