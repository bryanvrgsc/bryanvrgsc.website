import React, { useState, useEffect } from 'react';
import { allCountries as allCountriesRaw } from 'country-telephone-data';
import type { CountryTelephoneData, PhoneInputProps } from '../../types/modules';
import { DYNAMIC_COLORS } from '../../constants/colors';


const allCountries = allCountriesRaw as CountryTelephoneData[];

/**
 * PhoneInput Component
 * 
 * International phone number input with country selector.
 * Features: search, autofill by geolocation, priority countries.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    countryCode,
    onChange,
    placeholder = 'Phone number',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState((countryCode || 'US').toUpperCase());

    // Priority countries to show first
    const priorityCountries = ['US', 'MX', 'ES', 'GB', 'CA'];

    // Sync local state with prop changes
    useEffect(() => {
        if (countryCode) {
            const normalizedCode = countryCode.toUpperCase();
            setSelectedCountryCode(normalizedCode);
        }
    }, [countryCode]);

    // Geolocation disabled - using language-based country selection instead
    // useEffect(() => {
    //     if (!countryCode) {
    //         fetch('https://ipapi.co/json/')
    //             .then(res => res.json())
    //             .then(data => {
    //                 if (data.country_code) {
    //                     const detectedCountry = allCountries.find(
    //                         c => c.iso2 === data.country_code
    //                     );
    //                     if (detectedCountry) {
    //                         setSelectedCountryCode(detectedCountry.iso2);
    //                         onChange(value, detectedCountry.iso2);
    //                     }
    //                 }
    //             })
    //             .catch(() => {
    //                 // Silently fail, keep default
    //             });
    //     }
    // }, []);

    // React to countryCode prop changes (e.g., when language changes)
    useEffect(() => {
        if (countryCode) {
            setIsOpen(false);
            setSearchQuery('');
        }
    }, [countryCode]);

    // Filter countries based on search query
    const filteredCountries = allCountries.filter(country => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            country.name.toLowerCase().includes(query) ||
            country.iso2.toLowerCase().includes(query) ||
            country.dialCode.includes(query)
        );
    });

    // Sort countries: priority first, then alphabetically
    const sortedCountries = [...filteredCountries].sort((a, b) => {
        const aIsPriority = priorityCountries.includes(a.iso2);
        const bIsPriority = priorityCountries.includes(b.iso2);

        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;

        return a.name.localeCompare(b.name);
    });

    const selectedCountry = React.useMemo(() => {
        // Case-insensitive search to handle different formats in country-telephone-data
        const country = allCountries.find(c => c.iso2.toUpperCase() === selectedCountryCode.toUpperCase()) || allCountries[0];
        return country;
    }, [selectedCountryCode]);

    const handleCountryChange = (newCountryCode: string) => {
        setSelectedCountryCode(newCountryCode);
        onChange(value, newCountryCode);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const newValue = e.target.value.replace(/[^\d]/g, '');
        onChange(newValue, selectedCountryCode);
    };

    // Get flag emoji from country code
    const getFlagEmoji = (iso2: string) => {
        const codePoints = iso2
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return (
        <div className="relative w-full">
            <div className="flex gap-2">
                {/* Country Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        aria-label="Select country code"
                        className={`h-full px-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl text-[var(--text-primary)] focus:outline-none ${DYNAMIC_COLORS.focusBorder} focus:bg-[var(--glass-glow)] transition-all text-sm focus:ring-1 ${DYNAMIC_COLORS.focusRing} disabled:opacity-50 flex items-center gap-2 min-w-[100px]`}
                    >
                        <span className="text-xl">{getFlagEmoji(selectedCountry.iso2)}</span>
                        <span className="font-mono text-sm">+{selectedCountry.dialCode}</span>
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => {
                                    setIsOpen(false);
                                    setSearchQuery('');
                                }}
                            />
                            <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-xl z-20 overflow-hidden">
                                {/* Search Input */}
                                <div className="p-3 border-b border-[var(--card-border)]">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search country..."
                                            name="country-search"
                                            aria-label="Search country"
                                            className={`w-full pl-9 pr-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none ${DYNAMIC_COLORS.focusBorder}`}
                                        />
                                    </div>
                                </div>

                                {/* Countries List */}
                                <div className="max-h-64 overflow-y-auto">
                                    {sortedCountries.length > 0 ? (
                                        sortedCountries.map((country) => (
                                            <button
                                                key={country.iso2}
                                                type="button"
                                                onClick={() => handleCountryChange(country.iso2)}
                                                className={`w-full px-4 py-3 text-left hover:bg-[var(--input-bg)] transition-colors flex items-center gap-3 ${country.iso2 === countryCode ? 'bg-[var(--input-bg)]' : ''
                                                    }`}
                                            >
                                                <span className="text-xl">{getFlagEmoji(country.iso2)}</span>
                                                <span className="flex-1 text-sm text-[var(--text-primary)]">{country.name}</span>
                                                <span className="font-mono text-sm text-[var(--text-secondary)]">+{country.dialCode}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-sm text-[var(--text-tertiary)]">
                                            No countries found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={value}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    name="phone"
                    aria-label="Phone number"
                    autoComplete="tel-national"
                    className={`flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl px-5 py-5 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none ${DYNAMIC_COLORS.focusBorder} focus:bg-[var(--glass-glow)] transition-all text-sm focus:ring-1 ${DYNAMIC_COLORS.focusRing} disabled:opacity-50`}
                />
            </div>
        </div>
    );
};
