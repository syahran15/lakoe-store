import { Stack } from '@chakra-ui/react';
import { redirect, type ActionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { ImplementGrid } from '~/layouts/Grid';
import { Action } from '~/modules/product/components/Action';
import { Price } from '~/modules/product/components/Price';
import { ProductDetail } from '~/modules/product/components/ProductDetail';
import { ProductInformation } from '~/modules/product/components/ProductInformation';
import { ProductManagement } from '~/modules/product/components/ProductManagement';
// import { ProductVariant } from '~/modules/product/components/ProductVariant';
import { WeightAndShipment } from '~/modules/product/components/WeightAndShipment';
import { createProduct } from '~/modules/product/product.service';
import { uploadImage } from '~/utils/uploadImage';
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';

export async function action({ request }: ActionArgs) {
  const uploadHandler = composeUploadHandlers(async ({ name, data }) => {
    if (name !== 'image') {
      return undefined;
    }

    const uploadedImage = await uploadImage(data);

    return uploadedImage.secure_url;
  }, createMemoryUploadHandler());

  const formData = await parseMultipartFormData(request, uploadHandler);

  const imageUrl = formData.get('image') as string;

  console.log('image', imageUrl);

  if (request.method.toLowerCase() === 'post') {
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      url: imageUrl,
      minumumOrder: Number(formData.get('min_order')),
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      sku: formData.get('sku'),
      slug: formData.get('url'),
      category: formData.get('category') as string,
      weight: parseInt(formData.get('weight') as string),
      length: parseFloat(formData.get('length') as string),
      width: parseFloat(formData.get('width') as string),
      height: parseFloat(formData.get('height') as string),
    };
    await createProduct(data, '1');
    return redirect('/product');
  }
  return null;
}

export default function AddProduct() {
  return (
    <ImplementGrid>
      <Form method="post" encType="multipart/form-data">
        <Stack mt={'7.5vh'} spacing={4}>
          <ProductInformation />
          <ProductDetail />
          {/* <ProductVariant /> */}
          <Price />
          <ProductManagement />
          <WeightAndShipment />
          <Action />
        </Stack>
      </Form>
    </ImplementGrid>
  );
}
