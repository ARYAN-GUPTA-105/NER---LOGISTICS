import React, { useState } from 'react';
import { Truck, Building2, MapPin, ShieldCheck } from 'lucide-react';
import { ROLES } from '../data/roles';
import type { RoleId } from '../data/roles';
import styles from './RoleSelection.module.css';

const IconMap: Record<string, React.ReactNode> = {
  'Truck': <Truck size={28} />,
  'Building2': <Building2 size={28} />,
  'MapPin': <MapPin size={28} />,
  'ShieldCheck': <ShieldCheck size={28} />
};

interface RoleSelectionProps {
  onContinue: (roleId: RoleId) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onContinue }) => {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onContinue(selectedRole);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>SMART NER LOGISTICS</h1>
        <p className={styles.subtitle}>AI-Powered Logistics & Accessibility Platform</p>
      </header>

      <main className={styles.grid}>
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={styles.card}
            data-selected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
            aria-pressed={selectedRole === role.id}
          >
            <div className={styles.iconWrapper}>
              {IconMap[role.icon]}
            </div>
            <h2 className={styles.cardTitle}>{role.name}</h2>
            <p className={styles.cardDesc}>{role.description}</p>
          </button>
        ))}
      </main>

      <div className={styles.actionArea}>
        <button 
          className={styles.continueBtn}
          disabled={!selectedRole}
          onClick={handleContinue}
          aria-disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
