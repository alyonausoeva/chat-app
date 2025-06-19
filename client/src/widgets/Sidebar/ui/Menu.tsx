import { selectUser } from 'app/store';
import { useCurrentChat } from 'entities/sidebar-chat';
import { setUser } from 'entities/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BAR } from 'shared/constants';
import { EmojiAvatar } from 'shared/ui';

export const Menu = () => {
  const user = selectUser();
  const { clearCurrentChat } = useCurrentChat();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    dispatch(setUser(null));
    navigate('/login');
    clearCurrentChat();
  };

  return (
    <div className={`${BAR} top-12 left-2 items-start`}>
      <div className="flex items-center gap-2">
        <EmojiAvatar avatar={user.avatar} />
        {user.name}
      </div>
      <button
        className="mt-4 cursor-pointer rounded-xl bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-400 focus:bg-gray-700"
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
};
