import * as React from 'react'

import { useAdaptiveCursor } from '../context/AdaptiveCursorContext'

type AdaptiveCursorTargetProps = {
	children: React.ReactNode
	active?: boolean
	onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const AdaptiveCursorTarget = (props: AdaptiveCursorTargetProps) => {
	const { config, onMouseOut, onMouseOver } = useAdaptiveCursor()
	const [activeStyles, setActiveStyles] = React.useState({})
	const targetRef = React.useRef(null)
	let active = props.active ?? true

	const buttonStyles: React.CSSProperties = {
		borderRadius: config.size
	}

	return (
		<div
			ref={targetRef}
			style={{
				...buttonStyles,
				...activeStyles
			}}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			onClick={props.onClick}
			onMouseDown={() =>
				setActiveStyles({
					boxShadow: '0 0 0 rgba(0, 0, 0, 0) !important',
					backgroundColor: 'rgba(0.3, 0.05, 0.1, 0.6)'
				})
			}
			onMouseUp={() => setActiveStyles({})}
		>
			{props.children}
		</div>
	)
}

export default AdaptiveCursorTarget
