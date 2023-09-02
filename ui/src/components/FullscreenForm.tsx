interface FullscreenFormProps {
  children?: React.ReactNode;
}

const FullscreenForm = ({ children }: FullscreenFormProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 grid place-content-center bg-white">
      <div className="w-[400px] rounded-md bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5">
        {children}
      </div>
    </div>
  );
};

export default FullscreenForm;
