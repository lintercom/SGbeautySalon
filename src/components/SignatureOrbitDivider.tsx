import { cn } from '../lib/utils';

interface SignatureOrbitDividerProps {
  side?: 'left' | 'right';
}

export default function SignatureOrbitDivider({ side = 'right' }: SignatureOrbitDividerProps) {
  return (
    <div
      className={cn('signature-divider', side === 'left' ? 'signature-divider-left' : 'signature-divider-right')}
      aria-hidden="true"
    >
      <div className="signature-orbit">
        <span className="signature-ring signature-ring-outer" />
        <span className="signature-ring signature-ring-middle" />
        <span className="signature-ring signature-ring-inner" />
        <span className="signature-orbit-arc" />
        <span className="signature-orbit-jewel" />
      </div>
    </div>
  );
}
