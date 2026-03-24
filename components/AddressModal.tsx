"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";

export default function AddressModal({
  onClose,
  onSuccess,
  initialData,
}: any) {
  const isEdit = !!initialData;

  const [step, setStep] = useState<"city" | "district" | "ward">("city");

  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [keyword, setKeyword] = useState("");

  const [selected, setSelected] = useState({
    city: null as any,
    district: null as any,
    ward: null as any,
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    detail: "",
    isDefault: false,
  });

  // 👉 load data edit
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        phone: initialData.phone,
        detail: initialData.detail || "",
        isDefault: initialData.isDefault || false,
      });
    }
  }, [initialData]);

  // LOAD CITY
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setCities);
  }, []);

  const loadDistrict = async (code: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
    const data = await res.json();
    setDistricts(data.districts);
  };

  const loadWard = async (code: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
    const data = await res.json();
    setWards(data.wards);
  };

  const handleSelect = async (item: any) => {
    if (step === "city") {
      setSelected({ city: item, district: null, ward: null });
      setStep("district");
      await loadDistrict(item.code);
    } else if (step === "district") {
      setSelected((prev) => ({ ...prev, district: item, ward: null }));
      setStep("ward");
      await loadWard(item.code);
    } else {
      setSelected((prev) => ({ ...prev, ward: item }));
    }
  };

  const handleSubmit = async () => {
    console.log(initialData);   
    if (!form.name || !form.phone || !selected.ward) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const url = isEdit
      ? `/api/user/address/${initialData._id}`
      : "/api/user/address";

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        detail: form.detail,
        city: selected.city?.name,
        district: selected.district?.name,
        ward: selected.ward?.name,
        isDefault: form.isDefault,
      }),
    });

    toast.success(isEdit ? "Cập nhật thành công" : "Thêm thành công");

    onSuccess();
    onClose();
  };

  const filterList = (list: any[]) =>
    list.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );

  const renderList = () => {
    if (step === "city") return filterList(cities);
    if (step === "district") return filterList(districts);
    return filterList(wards);
  };

  return (
    <Overlay>
      <Modal>
        <Title>{isEdit ? "Cập nhật địa chỉ" : "Địa chỉ mới"}</Title>

        <Row>
          <Input
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Row>

        <SearchBox>
          <input
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </SearchBox>

        <Tabs>
          <Tab active={step === "city"}>Tỉnh/Thành phố</Tab>
          <Tab active={step === "district"}>Quận/Huyện</Tab>
          <Tab active={step === "ward"}>Phường/Xã</Tab>
        </Tabs>

        <List>
          {renderList().map((item: any) => (
            <Item
              key={item.code}
              onClick={() => {
                handleSelect(item);
                setKeyword("");
              }}
            >
              {item.name}
            </Item>
          ))}
        </List>

        <Selected>
          {[selected.city?.name, selected.district?.name, selected.ward?.name]
            .filter(Boolean)
            .join(" - ")}
        </Selected>

        <Input
          placeholder="Địa chỉ chi tiết"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
        />

        <Checkbox>
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) =>
              setForm({ ...form, isDefault: e.target.checked })
            }
          />
          Đặt làm mặc định
        </Checkbox>

        <Actions>
          <Cancel onClick={onClose}>Hủy</Cancel>
          <Submit onClick={handleSubmit}>
            {isEdit ? "Cập nhật" : "Hoàn thành"}
          </Submit>
        </Actions>
      </Modal>
    </Overlay>
  );
}
const Selected = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #fff6f5;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #ee4d2d;
  font-size: 14px;
`;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  width: 600px;
  background: white;
  border-radius: 8px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
`;

const SearchBox = styled.div`
  margin-bottom: 10px;

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div<{ active?: boolean }>`
  padding: 10px;
  cursor: pointer;
  color: ${(p) => (p.active ? "#ee4d2d" : "#555")};
  border-bottom: ${(p) => (p.active ? "2px solid #ee4d2d" : "none")};
`;

const List = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const Item = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
`;

const Cancel = styled.button`
  padding: 8px 16px;
  background: #eee;
  border: none;
  cursor: pointer;
`;

const Submit = styled.button`
  padding: 8px 16px;
  background: #ee4d2d;
  color: white;
  border: none;
  cursor: pointer;
`;