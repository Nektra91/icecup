import "./common.css"; // Make sure to create this CSS file

interface SpinnerProps {
  isLoading: boolean;
}

export const Spinner = ({ isLoading }: SpinnerProps) => {
  return isLoading ? (
    <div className="spinner">
      <div className="spinner-circle"></div>
    </div>
  ) : null;
};

export default Spinner;
