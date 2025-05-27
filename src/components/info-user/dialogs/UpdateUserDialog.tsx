import { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/lib/client/store/slices/userSlice';
import { updateUserProfile } from '@/lib/client/services/apiService';
import { RootState } from '@/lib/client/store/store';
import { UpdateUser } from '@/lib/client/types/types';
import { DEFAULT_UPDATE_USER_DATA } from '@/lib/client/types/dataTypes';
import useApiMutation from '@/lib/client/services/useApiMutation';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface UpdateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UpdateUserFormData extends Omit<UpdateUser, 'birthday'> {
  birthday: Dayjs | undefined;
}

const UpdateUserDialog = ({ open, onOpenChange }: UpdateUserDialogProps) => {
  const t = useTranslations('InfoUser');
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const tValidation = useTranslations('ValidationErrors');
  const [form] = Form.useForm<UpdateUserFormData>();

  const disabledDate = (current: Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

  const { trigger, isMutating } = useApiMutation(
    'updateUserProfile',
    async (data: UpdateUser) => {
      const res = await updateUserProfile(data, userData.id?.toString() ?? '');
      return res;
    }
  );

  const onSubmit = async (values: UpdateUserFormData) => {
    try {
      const submitData: UpdateUser = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
      };

      const res = await trigger(submitData);
      const result = {
        id: userData.id,
        name: res.name,
        email: res.email,
        phone: res.phone,
        birthday: res.birthday,
        gender: res.gender,
        password: userData.password,
        avatar: userData.avatar,
        role: userData.role,
      };
      dispatch(setUser(result));
      onOpenChange(false);
      form.resetFields();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.resetFields();
  };

  useEffect(() => {
    if (open && userData) {
      form.setFieldsValue({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthday: userData.birthday ? dayjs(userData.birthday) : undefined,
        gender: userData.gender,
      });
    }
  }, [open, userData, form]);

  return (
    <Modal
      title={
        <div className="text-center text-2xl font-bold">
          {t('updateProfile')}
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <div style={{ textAlign: 'center', marginBottom: '24px', color: '#666' }}>
        {t('updateYourInformation')}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={DEFAULT_UPDATE_USER_DATA}
        requiredMark={false}
      >
        <Form.Item
          label={t('name')}
          name="name"
          rules={[{ required: true, message: tValidation('requiredName') }]}
        >
          <Input
            placeholder={t('enterYourName')}
            size="large"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          label={t('email')}
          name="email"
          rules={[
            { required: true, message: tValidation('requiredEmail') },
            { type: 'email', message: tValidation('invalidEmail') },
          ]}
        >
          <Input
            type="email"
            placeholder={t('enterYourEmail')}
            size="large"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          label={t('phone')}
          name="phone"
          rules={[
            {
              pattern: /^[0-9]{10,}$/,
              message: tValidation('requiredPhone'),
            },
          ]}
        >
          <Input
            placeholder={t('enterYourPhone')}
            size="large"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('birthday')}
              name="birthday"
              rules={[
                {
                  required: true,
                  message: tValidation('requiredBirthday'),
                },
                {
                  validator: async (_, value) => {
                    if (value && value > dayjs().endOf('day')) {
                      throw new Error(tValidation('invalidBirthday'));
                    }
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%', borderRadius: '8px' }}
                size="large"
                format="YYYY-MM-DD"
                placeholder={t('selectBirthday')}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('gender')}
              name="gender"
              rules={[
                { required: true, message: tValidation('requiredGender') },
              ]}
            >
              <Select
                placeholder={t('selectGender')}
                size="large"
                style={{ borderRadius: '8px' }}
                allowClear
              >
                <Select.Option value={true}>{t('male')}</Select.Option>
                <Select.Option value={false}>{t('female')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
          <Space
            style={{ width: '100%', justifyContent: 'center' }}
            size="middle"
          >
            <Button
              onClick={handleCancel}
              size="large"
              style={{
                minWidth: '120px',
                borderRadius: '8px',
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isMutating}
              size="large"
              style={{
                minWidth: '120px',
                backgroundColor: '#f43f5e',
                borderColor: '#f43f5e',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                if (!isMutating) {
                  e.currentTarget.style.backgroundColor = '#e11d48';
                  e.currentTarget.style.borderColor = '#e11d48';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMutating) {
                  e.currentTarget.style.backgroundColor = '#f43f5e';
                  e.currentTarget.style.borderColor = '#f43f5e';
                }
              }}
              icon={isMutating ? <LoadingOutlined /> : null}
            >
              {isMutating ? t('updating') : t('update')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserDialog;
