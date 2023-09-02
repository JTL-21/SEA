interface FullscreenFormProps {
  children?: React.ReactNode;
}

const FullscreenForm = ({ children }: FullscreenFormProps) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 grid place-content-center bg-gray-100 bg-[size:300px] bg-center"
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      <div className="ring-border w-[400px] rounded-md bg-white p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default FullscreenForm;
