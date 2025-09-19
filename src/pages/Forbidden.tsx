import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%',
      width: '100%'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={[
          <Button type="primary" key="home" onClick={handleGoHome}>
            Về trang chủ
          </Button>,
          <Button key="back" onClick={handleGoBack}>
            Quay lại
          </Button>,
        ]}
      />
    </div>
  );
};

export default Forbidden;
