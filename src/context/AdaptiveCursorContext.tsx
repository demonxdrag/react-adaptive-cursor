import { CSSProperties, MouseEvent, ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import gsap from 'gsap'
import useWindow from '../hooks/useWindow'

interface AdaptiveCursorConfig {
	size?: number
	transitionSpeed?: number
	parallaxIndex?: number
	mainCursorHoverColor?: string
	mainCursorLiftColor?: string
	shadow?: string
}

interface AdaptiveCursorState {
	config?: AdaptiveCursorConfig
}

interface AdaptiveCursorContextType extends AdaptiveCursorState {
	onMouseOver: (e: MouseEvent) => void
	onMouseOut: (e: MouseEvent) => void
}

const CursorContext = createContext<AdaptiveCursorContextType | undefined>(undefined)

interface AdaptiveCursorProviderProps {
	config?: AdaptiveCursorConfig
	children: ReactNode
}
export const AdaptiveCursorProvider = ({
	config = {
		size: 20, // Radius/size of the cursor
		transitionSpeed: 0.2, // Cursor speed
		parallaxIndex: 16, // How vv cvv you want to shift elements
		mainCursorHoverColor: 'rgb(0, 0, 0, 0.2)',
		mainCursorLiftColor: 'rgba(0,0,0,0)',
		shadow: '0 7px 15px rgba(0, 0, 0, 0.14)'
	},
	children
}: AdaptiveCursorProviderProps) => {
	const [visualHover, setVisualHover] = useState<boolean>(false)
	const hovered = useRef<boolean>(false)
	const target = useRef<HTMLElement | null>(null)
	const cursorRef = useRef<HTMLDivElement | null>(null)
	const windowData = useWindow()

  const radius = config.size / 2

	const cursorStyle: CSSProperties = useMemo(() => ({
    transform: 'translate(-200px, -200px)', // Start outside viewport
    height: `${config.size}px`,
    width: `${config.size}px`,
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    borderRadius: '100%',
    backgroundColor: visualHover ? config.mainCursorLiftColor : config.mainCursorHoverColor,
    transition: `background-color ${config.transitionSpeed}s ease-in-out`
  }), [config, visualHover]);

  useEffect(() => {
    // Cleanup
    return () => {
      hovered.current = false
      setVisualHover(false)
      target.current = null
      cursorRef.current = null
    }
  },[])

	const parallaxSpeed = {
		cursor: config.parallaxIndex,
		target: config.parallaxIndex * 1.5
	}

	const getMoveIndex = (mouseEventDirection: number, elPosition: number, elDimension: number, movementSpeed: number) => {
		let relativePos = mouseEventDirection - elPosition
		return (relativePos - elDimension / 2) / movementSpeed
	}

	const moveCursor = (e: MouseEvent) => {
		if (cursorRef.current && !windowData.touch) {
			if (!hovered.current || !target) {
				// If element is not hovered
				if (cursorRef.current) {
					gsap.to(cursorRef.current, {
						duration: config.transitionSpeed,
						x: e.clientX - radius,
						y: e.clientY - radius
					})
				}
			} else {
				// If element is hovered
				if (cursorRef.current) {
					gsap.to(cursorRef.current, {
						duration: config.transitionSpeed,
						filter: 'blur(8px)',
						x:
							target.current.getBoundingClientRect().left + radius +
							(e.clientX - target.current.getBoundingClientRect().left - target.current.clientWidth / 2) / parallaxSpeed.cursor,
						y:
							target.current.getBoundingClientRect().top + radius +
							(e.clientY - target.current.getBoundingClientRect().top - target.current.clientHeight / 2) / parallaxSpeed.cursor,
						backgroundImage: `radial-gradient(circle at ${e.clientX - target.current.getBoundingClientRect().left}px ${
							e.clientY - target.current.getBoundingClientRect().top
						}px, rgba(255,255,255,0.4), rgba(255,255,255,0))`
					})
				}
				if (target.current) {
					gsap.to(target.current, {
						duration: config.transitionSpeed,
						x: getMoveIndex(e.clientX, target.current.getBoundingClientRect().left, target.current.clientWidth, parallaxSpeed.target),
						y: getMoveIndex(e.clientY, target.current.getBoundingClientRect().top, target.current.clientHeight, parallaxSpeed.target),
						scale: 1.1,
						boxShadow: config.shadow
					})
				}
			}
		}
	}

	const handleMouseOver = (e: MouseEvent) => {
		hovered.current = true
		setVisualHover(true)
		target.current = e.target as HTMLElement
		activateHover(e)
	}

	const handleMouseOut = (e: MouseEvent) => {
		hovered.current = false
		setVisualHover(false)
		disableHover(e)
	}

	const activateHover = (e: MouseEvent) => {
		const newTarget = e.target as HTMLElement
		if (cursorRef.current) {
			const borderRadius = Number(window.getComputedStyle(newTarget).borderRadius.slice(0, -2))
			gsap.to(cursorRef.current, {
				duration: config.transitionSpeed,
				borderRadius: borderRadius,
				width: newTarget.clientWidth,
				height: newTarget.clientHeight,
				scale: 1.1
			})
		}
	}

	const disableHover = (e: MouseEvent) => {
		if (cursorRef.current) {
			gsap.to(cursorRef.current, {
				duration: config.transitionSpeed,
				width: config.size,
				height: config.size,
				borderRadius: '100px',
				scale: 1,
				backgroundImage: 'none',
				filter: 'blur(0px)'
			})
		}

		gsap.to(e.target, {
			duration: config.transitionSpeed,
			x: 0,
			y: 0,
			scale: 1,
			boxShadow: '0 7px 15px rgba(0,0,0,0.0)'
		})
	}

	return (
		<CursorContext.Provider value={{ config, onMouseOver: handleMouseOver, onMouseOut: handleMouseOut }}>
			<div onMouseMove={moveCursor}>
				<div ref={cursorRef} style={cursorStyle}></div>
				{children}
			</div>
		</CursorContext.Provider>
	)
}

export const useAdaptiveCursor = () => {
	const context = useContext(CursorContext)
	if (!context) throw new Error('useCursor must be used within a CursorProvider')
	return context
}
