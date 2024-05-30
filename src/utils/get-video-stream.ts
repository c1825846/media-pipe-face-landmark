export const getVideoStream = async () => {
  if (!navigator?.mediaDevices?.getUserMedia) {
    return null
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
  } catch {
    return null
  }
}
