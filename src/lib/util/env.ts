export const getBaseURL = () => {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://orizont-srl.ro").replace(
    /\/+$/,
    ""
  )
}
