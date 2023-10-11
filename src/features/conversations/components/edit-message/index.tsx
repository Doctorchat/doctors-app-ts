interface EditIconProps {
  handlerEditMessage: () => void;
}
export const EditIcon: React.FC<EditIconProps> = ({ handlerEditMessage }: any) => {
  return (
    <button
      onClick={handlerEditMessage}
      className="z-9 !m-0 h-[18px] max-h-[40px] min-h-[26px] w-[18px] min-w-[26px] max-w-[40px] cursor-pointer  rounded-full border border-neutral-200  bg-white shadow-lg"
      type="button"
    >
      <span className="flex items-center justify-center">
        <svg
          height={13}
          width={13}
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="pen"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="svg-inline--fa fa-pen fa-w-16 fa-7x"
        >
          <path
            fill="currentColor"
            d="M493.26 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.25 18.74l-74.49 74.49L256 127.98 12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.79-.05 2.69-.15l114.14-12.61L384.02 256l34.74-34.74 74.49-74.49c25-25 25-65.52.01-90.51zM118.75 453.39l-67.58 7.46 7.53-67.69 231.24-231.24 31.02-31.02 60.14 60.14-31.02 31.02-231.33 231.33zm340.56-340.57l-44.28 44.28-60.13-60.14 44.28-44.28c4.08-4.08 8.84-4.69 11.31-4.69s7.24.61 11.31 4.69l37.51 37.51c6.24 6.25 6.24 16.4 0 22.63z"
          ></path>
        </svg>
      </span>
    </button>
  );
};
