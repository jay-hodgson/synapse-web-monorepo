import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

const AccountRegistered = (props: SvgIconProps) => {
  return (
    <SvgIcon
      {...props}
      viewBox="4 -1 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="25" r="25" fill="#1C76AF" />
      <path
        d="M16 34.8317C16 28.112 21.4478 22.6643 28.1679 22.6643C34.8879 22.6643 40.3357 28.112 40.3357 34.8322L16 34.8317Z"
        fill="white"
      />
      <path
        d="M28.3533 21.0504C31.4048 21.0504 33.8785 18.5767 33.8785 15.5252C33.8785 12.4737 31.4048 10 28.3533 10C25.3018 10 22.8281 12.4737 22.8281 15.5252C22.8281 18.5767 25.3018 21.0504 28.3533 21.0504Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.5 23C40.6422 23 44 26.3613 44 30.5077C44 34.6541 40.6422 38.0154 36.5 38.0154C32.3578 38.0154 29 34.6541 29 30.5077C29 26.3613 32.3578 23 36.5 23Z"
        fill="#62AC62"
      />
      <path
        d="M29 30.5077C29 34.6541 32.3578 38.0154 36.5 38.0154V23C32.3578 23 29 26.3613 29 30.5077Z"
        fill="white"
        fillOpacity="0.1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.9181 30.7493L32.002 31.7027L34.9466 34.7671L41.4903 27.9573L40.5742 27.0039L34.9466 32.8604L32.9181 30.7493Z"
        fill="white"
      />
    </SvgIcon>
  )
}

export default AccountRegistered
