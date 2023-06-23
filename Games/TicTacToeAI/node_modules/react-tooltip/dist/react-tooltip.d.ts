import React, { ElementType, ReactNode, CSSProperties, PropsWithChildren } from 'react';

type PlacesType = 'top' | 'right' | 'bottom' | 'left'

type VariantType = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

type WrapperType = ElementType | 'div' | 'span'

type ChildrenType = Element | ElementType | ReactNode

type EventsType = 'hover' | 'click'

type PositionStrategy = 'absolute' | 'fixed'

type DataAttribute =
  | 'place'
  | 'content'
  | 'html'
  | 'variant'
  | 'offset'
  | 'wrapper'
  | 'events'
  | 'position-strategy'
  | 'delay-show'
  | 'delay-hide'
  | 'float'
  | 'hidden'

/**
 * @description floating-ui middleware
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Middleware = any

interface IPosition {
  x: number
  y: number
}

interface ITooltipController {
  className?: string
  classNameArrow?: string
  content?: string
  /**
   * @deprecated Use `children` or `render` instead
   */
  html?: string
  render?: (render: { content: string | null; activeAnchor: HTMLElement | null }) => ChildrenType
  place?: PlacesType
  offset?: number
  id?: string
  variant?: VariantType
  /**
   * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
   * See https://react-tooltip.com/docs/getting-started
   */
  anchorId?: string
  anchorSelect?: string
  wrapper?: WrapperType
  children?: ChildrenType
  /**
   * @deprecated Use `openOnClick` instead.
   */
  events?: EventsType[]
  openOnClick?: boolean
  positionStrategy?: PositionStrategy
  middlewares?: Middleware[]
  delayShow?: number
  delayHide?: number
  float?: boolean
  hidden?: boolean
  noArrow?: boolean
  clickable?: boolean
  /**
   * @todo refactor to `hideOnEsc` for naming consistency
   */
  closeOnEsc?: boolean
  /**
   * @todo refactor to `hideOnScroll` for naming consistency
   */
  closeOnScroll?: boolean
  /**
   * @todo refactor to `hideOnResize` for naming consistency
   */
  closeOnResize?: boolean
  style?: CSSProperties
  position?: IPosition
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  afterShow?: () => void
  afterHide?: () => void
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-tooltip-id'?: string
    'data-tooltip-place'?: PlacesType
    'data-tooltip-content'?: string
    'data-tooltip-html'?: string
    'data-tooltip-variant'?: VariantType
    'data-tooltip-offset'?: number
    'data-tooltip-wrapper'?: WrapperType
    /**
     * @deprecated Use `openOnClick` tooltip prop instead.
     */
    'data-tooltip-events'?: EventsType[]
    'data-tooltip-position-strategy'?: PositionStrategy
    'data-tooltip-delay-show'?: number
    'data-tooltip-delay-hide'?: number
    'data-tooltip-float'?: boolean
    'data-tooltip-hidden'?: boolean
  }
}

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
interface ITooltipWrapper {
  tooltipId?: string
  children: ReactNode
  className?: string

  place?: ITooltipController['place']
  content?: ITooltipController['content']
  html?: ITooltipController['html']
  variant?: ITooltipController['variant']
  offset?: ITooltipController['offset']
  wrapper?: ITooltipController['wrapper']
  events?: ITooltipController['events']
  positionStrategy?: ITooltipController['positionStrategy']
  delayShow?: ITooltipController['delayShow']
  delayHide?: ITooltipController['delayHide']
}

declare const TooltipController: ({ id, anchorId, anchorSelect, content, html, render, className, classNameArrow, variant, place, offset, wrapper, children, events, openOnClick, positionStrategy, middlewares, delayShow, delayHide, float, hidden, noArrow, clickable, closeOnEsc, closeOnScroll, closeOnResize, style, position, isOpen, setIsOpen, afterShow, afterHide, }: ITooltipController) => JSX.Element;

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
declare const TooltipProvider: React.FC<PropsWithChildren<void>>;

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
declare const TooltipWrapper: ({ tooltipId, children, className, place, content, html, variant, offset, wrapper, events, positionStrategy, delayShow, delayHide, }: ITooltipWrapper) => JSX.Element;

export { ChildrenType, DataAttribute, EventsType, IPosition, ITooltipController as ITooltip, ITooltipWrapper, Middleware, PlacesType, PositionStrategy, TooltipController as Tooltip, TooltipProvider, TooltipWrapper, VariantType, WrapperType };
