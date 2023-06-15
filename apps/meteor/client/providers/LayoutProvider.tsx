import { useBreakpoints } from '@rocket.chat/fuselage-hooks';
import { LayoutContext, useNavigate, useQueryStringParameter, useSetting } from '@rocket.chat/ui-contexts';
import type { FC } from 'react';
import React, { useMemo, useState, useEffect } from 'react';

const LayoutProvider: FC = ({ children }) => {
	const showTopNavbarEmbeddedLayout = Boolean(useSetting('UI_Show_top_navbar_embedded_layout'));
	const [isCollapsed, setIsCollapsed] = useState(false);
	const layout = useQueryStringParameter('layout');
	const isEmbedded = layout === 'embedded';
	const breakpoints = useBreakpoints(); // ["xs", "sm", "md", "lg", "xl", xxl"]

	const isMobile = !breakpoints.includes('md');

	useEffect(() => {
		setIsCollapsed(isMobile);
	}, [isMobile]);

	const navigate = useNavigate();

	return (
		<LayoutContext.Provider
			children={children}
			value={useMemo(
				() => ({
					isMobile,
					isEmbedded,
					showTopNavbarEmbeddedLayout,
					sidebar: {
						isCollapsed,
						toggle: () => setIsCollapsed((isCollapsed) => !isCollapsed),
						collapse: () => setIsCollapsed(true),
						expand: () => setIsCollapsed(false),
						close: () => (isEmbedded ? setIsCollapsed(true) : navigate('/home')),
					},
					size: {
						sidebar: '240px',
						contextualBar: breakpoints.includes('sm') ? '380px' : '100%',
					},
					contextualBarExpanded: breakpoints.includes('sm'),
					// eslint-disable-next-line no-nested-ternary
					contextualBarPosition: breakpoints.includes('sm') ? (breakpoints.includes('lg') ? 'relative' : 'absolute') : 'fixed',
				}),
				[isMobile, isEmbedded, showTopNavbarEmbeddedLayout, isCollapsed, breakpoints, navigate],
			)}
		/>
	);
};

export default LayoutProvider;
