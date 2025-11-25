const { Product, Category } = require('../models')

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });
    res.json({
      success: true,
      message: "Productos obtenidos exitosamente",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      data: null,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Producto obtenido exitosamente",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      data: null,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, description, categoryId, imageUrl } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son obligatorios",
        data: null,
      });
    }

    if (precio < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio no puede ser negativo",
        data: null,
      });
    }

    // validate category if provided
    if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Categoria no encontrada', data: null });
      }
    }

    const newProduct = await Product.create({ nombre, precio, description, CategoryId: categoryId, imageUrl });

    res.status(201).json({
      succes: true,
      message: "Producto creado exitosamente",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      data: null,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, description, categoryId, imageUrl } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    if (precio && precio < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio no puede ser negativo",
        data: null,
      });
    }

    if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Categoria no encontrada', data: null });
      }
    }

    await product.update({ nombre, precio, description, CategoryId: categoryId, imageUrl });

    res.json({
        succes: true,
        message: "Producto actualizado exitosamente",
        data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      data: null,
    });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id) 

        if (!product) {
            res.json({
                success: false,
                message: "Producto no encontrado",
                data: null
            });
        }

        await product.destroy();

        res.json({
            success: true,
            message: "Producto eliminado exitosamente",
            data: null
        });
    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error al eliminar el producto",
            data: null
        })
    }
}