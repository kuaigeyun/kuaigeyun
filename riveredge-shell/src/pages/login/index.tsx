/**
 * 登录页面
 * 
 * 使用 ProForm 实现登录表单，支持用户名/密码登录
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from '@umijs/max';
import { login } from '@/services/auth';
import { setToken, setTenantId } from '@/utils/auth';
import './index.less';

/**
 * 登录表单数据接口
 */
interface LoginFormData {
  username: string;
  password: string;
}

/**
 * 登录页面组件
 */
export default function LoginPage() {
  const navigate = useNavigate();
  
  /**
   * 处理登录提交
   * 
   * @param values - 表单数据
   */
  const handleSubmit = async (values: LoginFormData) => {
    try {
      const response = await login(values);
      
      if (response && response.token) {
        // 保存 Token
        setToken(response.token);
        
        // 保存租户 ID（如果响应中包含）
        if (response.tenant_id) {
          setTenantId(response.tenant_id);
        }
        
        message.success('登录成功');
        
        // 跳转到仪表盘
        navigate('/dashboard');
      } else {
        message.error('登录失败，请检查用户名和密码');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请稍后重试');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>RiverEdge SaaS</h1>
          <p>多租户管理框架</p>
        </div>
        
        <ProForm<LoginFormData>
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            submitButtonProps: {
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
        >
          <ProFormText
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
            fieldProps={{
              size: 'large',
            }}
          />
          
          <ProFormText.Password
            name="password"
            label="密码"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            fieldProps={{
              size: 'large',
            }}
          />
        </ProForm>
      </div>
    </div>
  );
}

