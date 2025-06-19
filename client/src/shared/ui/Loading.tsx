import Spinner from 'shared/assets/spinner.svg';

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img className="h-20 w-20" src={Spinner} alt="icon" />
    </div>
  );
};
