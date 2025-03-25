import { useEffect, useState } from 'react'

const useWindow = () => {
	const [windowData, setWindow] = useState({ touch: false, width: window.innerWidth, height: window.innerHeight })
	useEffect(() => {
		const isTouchDevice = () => {
			return 'ontouchstart' in window || navigator.maxTouchPoints > 0
		}
		const width = window.innerWidth
		const height = window.innerHeight
		setWindow({ touch: isTouchDevice(), width, height })
	}, [])

	return windowData
}

export default useWindow
