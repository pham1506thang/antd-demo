import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
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
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
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

export default NotFound;
