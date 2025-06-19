import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { User } from 'shared/types';
import { EmojiAvatar } from 'shared/ui';

type HeaderProps = {
  recipent: User | null;
  onArrowClick: () => void;
};

export const Header = ({ recipent, onArrowClick }: HeaderProps) => {
  return (
    <div
      className={`${recipent ? 'flex' : 'flex lg:hidden'} h-16 w-full items-center bg-white px-4`}
    >
      <button className="block md:hidden" onClick={onArrowClick}>
        <ArrowLeftIcon className="mr-4 h-5 w-5 text-gray-500" />
      </button>
      {recipent && (
        <>
          <EmojiAvatar avatar={recipent.avatar} />
          <div className="ml-4">{recipent.name}</div>
        </>
      )}
    </div>
  );
};
