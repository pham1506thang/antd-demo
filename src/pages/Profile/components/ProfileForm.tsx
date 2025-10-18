import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, message, Flex } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '@/api/slices/authApi';
import type { User } from '@/models/user';
import { AvatarUpload } from '@/components';
import { getImageUrl, getThumbnailUrl } from '@/helpers/media';
import { useApiFormErrorHandler } from '@/hooks';
import { meSelector } from '@/store/slices/authSlice';
import { IMAGE_SIZES } from '@/constants/media';

interface ProfileFormProps {
}

export const ProfileForm: React.FC<ProfileFormProps> = () => {
  const [form] = Form.useForm();
  const [updateProfile] = useUpdateProfileMutation();
  const { handleFormApiError } = useApiFormErrorHandler();
  const me = useSelector(meSelector);
  const [draftAvatar, setDraftAvatar] = useState<string | undefined>();

  // Sync form values with me when me changes
  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        firstName: me.firstName,
        lastName: me.lastName,
        email: me.email,
        avatarUrl: me.avatarUrl,
        thumbnailAvatarUrl: me.thumbnailAvatarUrl,
      });
      setDraftAvatar(undefined);
    }
  }, [me, form]);

  const handleSubmit = async (values: Pick<User, 'firstName' | 'lastName' | 'email' | 'avatarUrl' | 'thumbnailAvatarUrl'>) => {
    // Only update fields that have values (trimmed)
    const updateData: { firstName?: string; lastName?: string; email?: string; avatarUrl?: string; thumbnailAvatarUrl?: string } = {};
    
    if (values.firstName != undefined ) {
      const trimmedFirstName = values.firstName.trim();
      if (trimmedFirstName !== '') {
        updateData.firstName = trimmedFirstName;
      }
    }
    
    if (values.lastName != undefined) {
      const trimmedLastName = values.lastName.trim();
      if (trimmedLastName !== '') {
        updateData.lastName = trimmedLastName;
      }
    }
    
    if (values.email != undefined) {
      const trimmedEmail = values.email.trim();
      if (trimmedEmail !== '') {
        updateData.email = trimmedEmail;
      }
    }
    
    if (values.avatarUrl != undefined) {
      updateData.avatarUrl = values.avatarUrl;
    }
    
    if (values.thumbnailAvatarUrl != undefined) {
      updateData.thumbnailAvatarUrl = values.thumbnailAvatarUrl;
    }
    
    // Don't submit if no fields to update
    if (Object.keys(updateData).length === 0) {
      return;
    }
    
    try {
      await updateProfile(updateData).unwrap();
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  if (!me) {
    return null;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={me}
      onFinish={handleSubmit}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item name="avatarUrl" label="Ảnh đại diện">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AvatarUpload 
                defaultAvatar={me.thumbnailAvatarUrl}
                draftAvatar={draftAvatar}
                onMediaChange={(media) => {
                  const thumbnailUrl = getThumbnailUrl(media.sizes);
                  const avatarUrl = getImageUrl(media.sizes, IMAGE_SIZES.MEDIUM);
                  form.setFieldsValue({
                    avatarUrl: avatarUrl,
                    thumbnailAvatarUrl: thumbnailUrl
                  });
                  console.log(form.getFieldsValue());
                  setDraftAvatar(thumbnailUrl || undefined);
                }}
                onClear={() => {
                  // Reset avatar fields to original values from me
                  form.setFieldsValue({
                    avatarUrl: me.avatarUrl,
                    thumbnailAvatarUrl: me.thumbnailAvatarUrl
                  });
                  setDraftAvatar(undefined);
                }}
              />
            </div>
          </Form.Item>
          <Form.Item name="thumbnailAvatarUrl" label="Ảnh đại diện" hidden><div></div></Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item name="firstName" label="Tên">
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="lastName" label="Họ">
            <Input placeholder="Nhập họ" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item>
        <Flex justify="end">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Lưu thay đổi
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

