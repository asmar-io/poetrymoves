import CommonButton from './CommonButton'

const ShadowButton = ({ children, isLoading, onClick, className, style }) => {
  return (
    <CommonButton
      isLoading={isLoading}
      onClick={onClick}
      style={style}
      className={
        `bg-white border border-white hover:border-gray-300 uppercase shadow-lg hover:shadow-2xl
        text-2xl px-5 py-2.5 text-center h-fit min-w-fit m-2 transition-all duration-200 ` +
        (className || '')
      }
    >
      {children}
    </CommonButton>
  )
}

export default ShadowButton
