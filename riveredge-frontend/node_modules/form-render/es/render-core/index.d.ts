import './index.less';
interface RenderCoreProps {
    schema: any;
    rootPath?: any[] | undefined;
    parentPath?: any[] | undefined;
    [key: string]: any;
}
declare const RenderCore: (props: RenderCoreProps) => any;
export default RenderCore;
