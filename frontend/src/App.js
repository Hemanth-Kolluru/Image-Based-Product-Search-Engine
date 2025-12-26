import React, { useState } from "react";
import {
  Upload,
  Card,
  Row,
  Col,
  Button,
  Spin,
  Tag,
  Typography,
  Divider
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { searchImage } from "./api";

const { Title, Text } = Typography;

function App() {
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file }) => {
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setProducts([]);

    try {
      const res = await searchImage(file);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 1200, margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Image-Based Product Search
      </Title>

      {/* Upload Section */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />}>
            Upload Product Image
          </Button>
        </Upload>

        {/* Image Preview */}
        {preview && (
          <div style={{ marginTop: 20 }}>
            <Text strong>Uploaded Image Preview</Text>
            <br />
            <img
              src={preview}
              alt="Preview"
              style={{
                marginTop: 10,
                width: 260,
                borderRadius: 12,
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)"
              }}
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin size="large" />
          <p>Searching similar products...</p>
        </div>
      )}

      {/* Results */}
      <Row gutter={[24, 24]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <Card
              hoverable
              cover={
                <img
                  alt={p.name}
                  src={p.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
            >
              <Card.Meta
                title={p.name}
                description={
                  <>
                    <Text>{p.description}</Text>

                    <Divider style={{ margin: "10px 0" }} />

                    {p.relevance !== undefined && (
                      <Tag color="green">
                        Relevance Score: {p.relevance}
                      </Tag>
                    )}

                    <div style={{ marginTop: 10 }}>
                      {p.tags.map((tag) => (
                        <Tag color="blue" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {!loading && preview && products.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Text type="secondary">No matching products found</Text>
        </div>
      )}
    </div>
  );
}

export default App;
