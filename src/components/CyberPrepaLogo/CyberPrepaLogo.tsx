
interface CyberPrepaLogoProps {
  size: string;
  display?: string;
}

const CyberPrepaLogo: React.FC<CyberPrepaLogoProps> = ({ size, display }) => {
  return (
    <img
      width={`${size}px`}
      src="../../src/assets/loginLogo.svg"
      alt="CyberPrepa Logo"
      style={{ display }}
    />
  );
};

export default CyberPrepaLogo;
