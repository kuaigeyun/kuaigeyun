import { getDOM } from "@rc-component/util/es/Dom/findDOMNode";
import { supportRef, useComposeRef, getNodeRef } from "@rc-component/util/es/ref";
import * as React from 'react';
import { CollectionContext } from "../Collection";
import { observe, unobserve } from "../utils/observerUtil";
function SingleObserver(props, ref) {
  const {
    children,
    disabled
  } = props;
  const elementRef = React.useRef(null);
  const onCollectionResize = React.useContext(CollectionContext);

  // =========================== Children ===========================
  const isRenderProps = typeof children === 'function';
  const mergedChildren = isRenderProps ? children(elementRef) : children;

  // ============================= Size =============================
  const sizeRef = React.useRef({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1
  });

  // ============================= Ref ==============================
  const canRef = !isRenderProps && /*#__PURE__*/React.isValidElement(mergedChildren) && supportRef(mergedChildren);
  const originRef = canRef ? getNodeRef(mergedChildren) : null;
  const mergedRef = useComposeRef(originRef, elementRef);
  const getDomElement = () => {
    return getDOM(elementRef.current);
  };
  React.useImperativeHandle(ref, () => getDomElement());

  // =========================== Observe ============================
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // Handler
  const onInternalResize = React.useCallback(target => {
    const {
      onResize,
      data
    } = propsRef.current;
    const {
      width,
      height
    } = target.getBoundingClientRect();
    const {
      offsetWidth,
      offsetHeight
    } = target;

    /**
     * Resize observer trigger when content size changed.
     * In most case we just care about element size,
     * let's use `boundary` instead of `contentRect` here to avoid shaking.
     */
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);
    if (sizeRef.current.width !== fixedWidth || sizeRef.current.height !== fixedHeight || sizeRef.current.offsetWidth !== offsetWidth || sizeRef.current.offsetHeight !== offsetHeight) {
      const size = {
        width: fixedWidth,
        height: fixedHeight,
        offsetWidth,
        offsetHeight
      };
      sizeRef.current = size;

      // IE is strange, right?
      const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
      const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
      const sizeInfo = {
        ...size,
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight
      };

      // Let collection know what happened
      onCollectionResize?.(sizeInfo, target, data);
      if (onResize) {
        // defer the callback but not defer to next frame
        Promise.resolve().then(() => {
          onResize(sizeInfo, target);
        });
      }
    }
  }, []);

  // Dynamic observe
  React.useEffect(() => {
    const currentElement = getDomElement();
    if (currentElement && !disabled) {
      observe(currentElement, onInternalResize);
    }
    return () => unobserve(currentElement, onInternalResize);
  }, [elementRef.current, disabled]);

  // ============================ Render ============================
  return canRef ? /*#__PURE__*/React.cloneElement(mergedChildren, {
    ref: mergedRef
  }) : mergedChildren;
}
const RefSingleObserver = /*#__PURE__*/React.forwardRef(SingleObserver);
if (process.env.NODE_ENV !== 'production') {
  RefSingleObserver.displayName = 'SingleObserver';
}
export default RefSingleObserver;