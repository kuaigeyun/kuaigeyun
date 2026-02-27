import { DefaultProps } from "./types";

// This class name is not matched to file name intentionally
/**
 * Event class to provide additional properties
 * @ko Component에서 추가적인 프로퍼티를 제공하는 이벤트 클래스
 */
class ComponentEvent<PROPS extends Record<string, any>, TYPE extends string = string, THIS = any> implements DefaultProps<TYPE, THIS> {
  /**
   * A Component instance that triggered event.
   * @type Component
   * @ko 이벤트를 트리거한 Component 인스턴스.
   * @example
   * ```ts
   * class ExtendedClass extends Component<{
   *   someEvent: ComponentEvent<{ foo: number; bar: string }>
   * }> {}
   *
   * new ExtendedClass().on("someEvent", e => {
   *   e.currentTarget; // ExtendedClass
   * });
   * ```
   */
  public currentTarget: THIS;

  /**
   * The name of the event.
   * @type string
   * @ko 이벤트 이름.
   * @example
   * ```ts
   * class ExtendedClass extends Component<{
   *   someEvent: ComponentEvent
   * }> {}
   *
   * new ExtendedClass().on("someEvent", e => {
   *   e.eventType; // "someEvent"
   * });
   * ```
   */
  public eventType: TYPE;

  private _canceled: boolean;

  /**
   * Create a new instance of ComponentEvent.
   * @ko ComponentEvent의 새로운 인스턴스를 생성한다.
   * @param eventType The name of the event.<ko>이벤트 이름.</ko>
   * @param props An object that contains additional event properties.<ko>추가적인 이벤트 프로퍼티 오브젝트.</ko>
   */
  public constructor(
    eventType: TYPE,
    props: PROPS
  ) {
    this._canceled = false;

    if (props) {
      for (const key of Object.keys(props as Record<string, any>)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this[key] = props[key];
      }
    }

    this.eventType = eventType;
  }

  /**
   * Stop the event. {@link ComponentEvent#isCanceled} will return `true` after.
   * @ko 이벤트를 중단한다. 이후 {@link ComponentEvent#isCanceled}가 `true`를 반환한다.
   */
  public stop() {
    this._canceled = true;
  }

  /**
   * Returns a boolean value that indicates whether {@link ComponentEvent#stop} is called before.
   * @ko {@link ComponentEvent#stop}이 호출되었는지 여부를 반환한다.
   * @return {boolean} A boolean value that indicates whether {@link ComponentEvent#stop} is called before.<ko>이전에 {@link ComponentEvent#stop}이 불려졌는지 여부를 반환한다.</ko>
   */
  public isCanceled() {
    return this._canceled;
  }
}

export default ComponentEvent;
