export const EmojiAvatar = ({ avatar }: { avatar?: string }) => {
  if (!avatar) {
    return null;
  }

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 pt-1 shadow-md"
      style={{ fontSize: 32 }}
    >
      {avatar}
    </div>
  );
};
