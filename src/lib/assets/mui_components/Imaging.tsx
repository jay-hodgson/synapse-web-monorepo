import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const Imaging = (props:SvgIconProps) => {
  const { fill, style } = props
  return (
    <SvgIcon style={style}>
      <path d="M8.54786 8.53307C8.41652 8.73571 8.19516 8.85714 7.95831 8.85714H5.12498C4.73392 8.85714 4.41665 9.18348 4.41665 9.58571V17.6C4.41665 18.0022 4.73392 18.3286 5.12498 18.3286H17.875C18.266 18.3286 18.5833 18.0022 18.5833 17.6V9.58571C18.5833 9.18348 18.266 8.85714 17.875 8.85714H15.0416C14.8048 8.85714 14.5834 8.73571 14.4521 8.53307L13.2457 6.67142H9.75431L8.54786 8.53307ZM17.875 7.39999C19.0489 7.39999 20 8.37826 20 9.58571V17.6C20 18.8074 19.0489 19.7857 17.875 19.7857H5.125C3.95109 19.7857 3 18.8074 3 17.6V9.58571C3 8.37826 3.95109 7.39999 5.125 7.39999H7.57904L8.78542 5.53835C8.91676 5.33571 9.13811 5.21428 9.37496 5.21428H13.625C13.8618 5.21428 14.0832 5.33571 14.2145 5.53835L15.4209 7.39999H17.875ZM11.5 16.8714C9.54406 16.8714 7.95833 15.2405 7.95833 13.2286C7.95833 11.2166 9.54396 9.58571 11.5 9.58571C13.456 9.58571 15.0417 11.2166 15.0417 13.2286C15.0417 15.2405 13.456 16.8714 11.5 16.8714ZM11.5 15.4143C12.6739 15.4143 13.625 14.436 13.625 13.2286C13.625 12.0211 12.6739 11.0429 11.5 11.0429C10.3261 11.0429 9.375 12.0211 9.375 13.2286C9.375 14.436 10.3261 15.4143 11.5 15.4143Z" fill={fill}/>
    </SvgIcon>
  )
}

export default Imaging