import './InfoDisplay.css';

interface InfoDisplayProps {
  title: string;
  message?: string;
}

const InfoDisplay = ({ title, message }: InfoDisplayProps) => {
  return (
    <div className="info-container">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InfoDisplay;
