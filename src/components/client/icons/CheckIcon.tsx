interface CheckIconProps {
  className?: string;
  size?: number;
}

export default function CheckIcon({
  className = 'w-5 h-5 text-green-500',
  size,
}: CheckIconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 448 512"
      xmlns="http://www.w3.org/2000/svg"
      {...(size && { width: size, height: size })}
    >
      <path
        fill="currentColor"
        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
      />
    </svg>
  );
}
