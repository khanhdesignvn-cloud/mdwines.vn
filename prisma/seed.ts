import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "vang-do",
    name: "Vang Đỏ",
    description:
      "Những chai vang đỏ đậm đà từ các vùng trồng nho danh tiếng thế giới, phù hợp cho các bữa tiệc sang trọng và món ăn đậm vị.",
    sortOrder: 1,
  },
  {
    slug: "vang-trang",
    name: "Vang Trắng",
    description:
      "Vang trắng tươi mát, thanh nhã, lựa chọn hoàn hảo cho hải sản và các buổi gặp gỡ nhẹ nhàng.",
    sortOrder: 2,
  },
  {
    slug: "vang-hong",
    name: "Vang Hồng",
    description: "Vang hồng (Rosé) tinh tế, hương vị cân bằng giữa vang đỏ và vang trắng.",
    sortOrder: 3,
  },
  {
    slug: "vang-no",
    name: "Vang Nổ & Champagne",
    description: "Champagne và vang nổ cao cấp cho những khoảnh khắc ăn mừng đáng nhớ.",
    sortOrder: 4,
  },
];

const countries = [
  { slug: "phap", name: "Pháp", flag: "🇫🇷" },
  { slug: "y", name: "Ý", flag: "🇮🇹" },
  { slug: "chile", name: "Chile", flag: "🇨🇱" },
  { slug: "uc", name: "Úc", flag: "🇦🇺" },
  { slug: "my", name: "Mỹ", flag: "🇺🇸" },
  { slug: "tay-ban-nha", name: "Tây Ban Nha", flag: "🇪🇸" },
  { slug: "argentina", name: "Argentina", flag: "🇦🇷" },
  { slug: "nam-phi", name: "Nam Phi", flag: "🇿🇦" },
];

type SeedProduct = {
  name: string;
  sku: string;
  category: string;
  country: string;
  region: string;
  vintage: number | null;
  grapeVariety: string;
  alcoholPercent: number;
  volumeMl?: number;
  price: number;
  salePrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  tastingNotes: string;
  foodPairing: string;
  awards?: string;
  rating: number;
  featured?: boolean;
  isNew?: boolean;
};

const products: SeedProduct[] = [
  {
    name: "Château La Rose Bordeaux Supérieur",
    sku: "MDW-FR-001",
    category: "vang-do",
    country: "phap",
    region: "Bordeaux",
    vintage: 2018,
    grapeVariety: "Cabernet Sauvignon, Merlot",
    alcoholPercent: 13.5,
    price: 890000,
    salePrice: 750000,
    stock: 42,
    shortDescription: "Vang đỏ Bordeaux cổ điển, cấu trúc chắc chắn, hậu vị dài.",
    description:
      "Được sản xuất tại vùng Bordeaux Supérieur trứ danh, Château La Rose là sự kết hợp hài hòa giữa Cabernet Sauvignon và Merlot, mang đến một chai vang đỏ có cấu trúc vững chắc nhưng vẫn mềm mại, thích hợp để hầm rượu thêm từ 3-5 năm hoặc thưởng thức ngay.",
    tastingNotes:
      "Hương thơm của mận chín, cassis, quyện cùng nốt gỗ sồi nhẹ và một chút cam thảo. Vị chát mịn, cân bằng tốt với axit tươi.",
    foodPairing: "Thịt bò áp chảo, sườn cừu nướng, phô mai lâu năm.",
    awards: "Huy chương Bạc - Concours General Agricole Paris",
    rating: 4.6,
    featured: true,
  },
  {
    name: "Château Margaux Grand Vin",
    sku: "MDW-FR-002",
    category: "vang-do",
    country: "phap",
    region: "Margaux, Bordeaux",
    vintage: 2016,
    grapeVariety: "Cabernet Sauvignon",
    alcoholPercent: 13,
    price: 15200000,
    stock: 6,
    shortDescription: "Một trong những đệ nhất danh xưởng của Bordeaux, đẳng cấp thượng hạng.",
    description:
      "Château Margaux là một trong bốn Premier Grand Cru Classé của Bordeaux, biểu tượng của sự tinh tế và quyền quý. Đây là lựa chọn dành cho những dịp đặc biệt hoặc làm quà tặng cao cấp.",
    tastingNotes: "Hoa violet, quả mâm xôi đen, khoáng chất tinh tế, tannin lụa mượt.",
    foodPairing: "Bò Wagyu, vịt quay, các món Âu cao cấp.",
    awards: "98 điểm - Robert Parker Wine Advocate",
    rating: 4.9,
    featured: true,
  },
  {
    name: "Penfolds Bin 389 Cabernet Shiraz",
    sku: "MDW-AU-001",
    category: "vang-do",
    country: "uc",
    region: "South Australia",
    vintage: 2019,
    grapeVariety: "Cabernet Sauvignon, Shiraz",
    alcoholPercent: 14.5,
    price: 1650000,
    stock: 30,
    shortDescription: "Được mệnh danh 'Baby Grange', đậm đà phong cách vang Úc.",
    description:
      "Bin 389 là sự pha trộn kinh điển giữa Cabernet Sauvignon và Shiraz, ủ trong thùng gỗ sồi Mỹ từng dùng cho dòng Grange danh tiếng, mang lại chiều sâu hương vị ấn tượng.",
    tastingNotes: "Quả mọng đen, socola đen, gỗ sồi nướng, tannin dày dặn.",
    foodPairing: "BBQ, thịt nướng than hoa, các món nhiều gia vị.",
    rating: 4.7,
    featured: true,
  },
  {
    name: "Penfolds Koonunga Hill Shiraz Cabernet",
    sku: "MDW-AU-002",
    category: "vang-do",
    country: "uc",
    region: "South Australia",
    vintage: 2021,
    grapeVariety: "Shiraz, Cabernet Sauvignon",
    alcoholPercent: 14,
    price: 520000,
    stock: 80,
    shortDescription: "Lựa chọn vang Úc phổ biến, dễ uống, giá trị tốt.",
    description:
      "Một trong những dòng vang bán chạy nhất của Penfolds tại Việt Nam, phù hợp cho các buổi tiệc thường ngày cũng như làm quà tặng đối tác.",
    tastingNotes: "Dâu đen, mận, gia vị nhẹ, hậu vị mềm mại.",
    foodPairing: "Pizza, mì Ý sốt bò, thịt nướng.",
    rating: 4.3,
  },
  {
    name: "Wolf Blass Grey Label Cabernet Sauvignon",
    sku: "MDW-AU-003",
    category: "vang-do",
    country: "uc",
    region: "South Australia",
    vintage: 2020,
    grapeVariety: "Cabernet Sauvignon",
    alcoholPercent: 14,
    price: 680000,
    stock: 55,
    shortDescription: "Vang đỏ đậm đà, cân bằng, thương hiệu quen thuộc.",
    description:
      "Wolf Blass Grey Label là dòng sản phẩm được yêu thích tại thị trường Việt Nam nhờ hương vị dễ tiếp cận nhưng vẫn giữ được sự phức hợp cần thiết.",
    tastingNotes: "Nho đen, việt quất, thảo mộc khô, tannin mềm.",
    foodPairing: "Bò bít tết, thịt cừu, phô mai cheddar.",
    rating: 4.4,
  },
  {
    name: "Antinori Tignanello",
    sku: "MDW-IT-001",
    category: "vang-do",
    country: "y",
    region: "Toscana",
    vintage: 2019,
    grapeVariety: "Sangiovese, Cabernet Sauvignon",
    alcoholPercent: 13.5,
    price: 5400000,
    stock: 10,
    shortDescription: "Siêu Tuscan huyền thoại, tiên phong định hình phong cách vang Ý hiện đại.",
    description:
      "Tignanello được xem là một trong những chai vang tiên phong của phong trào 'Super Tuscan', phá vỡ quy chuẩn truyền thống để tạo nên một kiệt tác đẳng cấp thế giới.",
    tastingNotes: "Anh đào đen, da thuộc, thảo mộc Địa Trung Hải, cấu trúc tannin tinh tế.",
    foodPairing: "Pasta sốt nấm truffle, thịt bê, phô mai Parmesan lâu năm.",
    awards: "95 điểm - Wine Spectator",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Marchesi Antinori Chianti Classico Riserva",
    sku: "MDW-IT-002",
    category: "vang-do",
    country: "y",
    region: "Chianti, Toscana",
    vintage: 2020,
    grapeVariety: "Sangiovese",
    alcoholPercent: 13.5,
    price: 980000,
    stock: 36,
    shortDescription: "Đại diện tiêu biểu cho phong cách vang Chianti Classico.",
    description:
      "Được ủ trong thùng gỗ sồi lớn theo phương pháp truyền thống, chai vang mang đậm bản sắc vùng Tuscany với vị chua thanh đặc trưng của giống nho Sangiovese.",
    tastingNotes: "Anh đào chín, cà chua sấy, gia vị hồi, hậu vị dài.",
    foodPairing: "Pizza Margherita, mì Ý sốt cà chua, thịt nguội Ý.",
    rating: 4.5,
  },
  {
    name: "Concha y Toro Casillero del Diablo Cabernet Sauvignon",
    sku: "MDW-CL-001",
    category: "vang-do",
    country: "chile",
    region: "Central Valley",
    vintage: 2022,
    grapeVariety: "Cabernet Sauvignon",
    alcoholPercent: 13.5,
    price: 320000,
    stock: 120,
    shortDescription: "Vang Chile bán chạy nhất, mềm mại, dễ uống, giá tốt.",
    description:
      "Casillero del Diablo là cái tên quen thuộc với người yêu vang Việt Nam, phù hợp cho các buổi họp mặt gia đình, tiệc công ty với chi phí hợp lý mà vẫn đảm bảo chất lượng.",
    tastingNotes: "Mâm xôi, dâu đen, vani nhẹ từ gỗ sồi.",
    foodPairing: "Thịt heo quay, gà nướng, các món Việt đậm vị.",
    rating: 4.2,
  },
  {
    name: "Concha y Toro Don Melchor",
    sku: "MDW-CL-002",
    category: "vang-do",
    country: "chile",
    region: "Puente Alto, Maipo Valley",
    vintage: 2018,
    grapeVariety: "Cabernet Sauvignon",
    alcoholPercent: 14.5,
    price: 3200000,
    stock: 14,
    shortDescription: "Chai vang biểu tượng đưa Chile lên bản đồ vang cao cấp thế giới.",
    description:
      "Don Melchor được sản xuất từ những vườn nho Cabernet Sauvignon lâu đời nhất tại Puente Alto, đại diện cho đỉnh cao chất lượng vang Chile.",
    tastingNotes: "Quả mâm xôi đen, cedar, khoáng chất núi Andes, tannin sang trọng.",
    foodPairing: "Bò Angus, thịt thú rừng, phô mai xanh.",
    awards: "97 điểm - James Suckling",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Trapiche Malbec Reserve",
    sku: "MDW-AR-001",
    category: "vang-do",
    country: "argentina",
    region: "Mendoza",
    vintage: 2021,
    grapeVariety: "Malbec",
    alcoholPercent: 13.5,
    price: 480000,
    stock: 65,
    shortDescription: "Malbec đặc trưng Argentina, đậm đà và ấm áp.",
    description:
      "Trồng ở độ cao hơn 900m so với mực nước biển tại Mendoza, giống nho Malbec cho ra chai vang có màu sắc đậm, hương vị tập trung và đầy năng lượng.",
    tastingNotes: "Mận đen, việt quất, cacao, khói nhẹ từ gỗ sồi.",
    foodPairing: "Bò nướng kiểu Argentina (Asado), sườn heo BBQ.",
    rating: 4.5,
    isNew: true,
  },
  {
    name: "Beringer Founders' Estate Cabernet Sauvignon",
    sku: "MDW-US-001",
    category: "vang-do",
    country: "my",
    region: "California",
    vintage: 2020,
    grapeVariety: "Cabernet Sauvignon",
    alcoholPercent: 13.5,
    price: 590000,
    stock: 48,
    shortDescription: "Vang California phong phú, hiện đại, dễ tiếp cận.",
    description:
      "Founders' Estate mang phong cách vang California điển hình: trái cây chín mọng, hương vani ấm áp từ gỗ sồi Mỹ, phù hợp với khẩu vị đa số thực khách.",
    tastingNotes: "Mâm xôi đen, vani, caramel nhẹ.",
    foodPairing: "Burger bò Mỹ, sườn nướng BBQ sốt cay.",
    rating: 4.3,
  },
  {
    name: "Marqués de Cáceres Rioja Crianza",
    sku: "MDW-ES-001",
    category: "vang-do",
    country: "tay-ban-nha",
    region: "Rioja",
    vintage: 2019,
    grapeVariety: "Tempranillo",
    alcoholPercent: 13.5,
    price: 560000,
    stock: 40,
    shortDescription: "Vang Tây Ban Nha cổ điển, cân bằng giữa trái cây và gỗ sồi.",
    description:
      "Được ủ 12 tháng trong thùng gỗ sồi Mỹ và Pháp, Rioja Crianza thể hiện rõ nét phong cách vùng Rioja: chín mọng nhưng vẫn giữ được độ tươi cần thiết.",
    tastingNotes: "Anh đào, dâu tây, đinh hương, hậu vị mượt.",
    foodPairing: "Tapas, thịt cừu quay, paella hải sản.",
    rating: 4.4,
  },
  {
    name: "Sauvignon Blanc Marlborough Cloudy Bay",
    sku: "MDW-NZ-001",
    category: "vang-trang",
    country: "uc",
    region: "Marlborough, New Zealand",
    vintage: 2022,
    grapeVariety: "Sauvignon Blanc",
    alcoholPercent: 13,
    price: 1150000,
    stock: 24,
    shortDescription: "Vang trắng tươi mát biểu tượng của New Zealand.",
    description:
      "Một trong những chai Sauvignon Blanc được săn đón nhất thế giới, nổi bật với sự tươi mát và hương thơm nhiệt đới đặc trưng.",
    tastingNotes: "Chanh dây, bưởi, cỏ tươi, axit sắc nét.",
    foodPairing: "Hàu sống, gỏi cuốn, salad hải sản.",
    rating: 4.7,
    featured: true,
  },
  {
    name: "Jacob's Creek Chardonnay",
    sku: "MDW-AU-004",
    category: "vang-trang",
    country: "uc",
    region: "South Eastern Australia",
    vintage: 2022,
    grapeVariety: "Chardonnay",
    alcoholPercent: 13,
    price: 350000,
    stock: 90,
    shortDescription: "Chardonnay dễ uống, phổ biến, phù hợp mọi bữa tiệc.",
    description:
      "Jacob's Creek Chardonnay mang hương vị trái cây nhiệt đới tươi mát cùng chút béo ngậy từ quá trình ủ, là lựa chọn an toàn cho các buổi tiệc đông người.",
    tastingNotes: "Dứa, đào vàng, bơ nhẹ.",
    foodPairing: "Gà nướng, hải sản áp chảo, pasta kem.",
    rating: 4.1,
  },
  {
    name: "Kim Crawford Sauvignon Blanc",
    sku: "MDW-NZ-002",
    category: "vang-trang",
    country: "uc",
    region: "Marlborough, New Zealand",
    vintage: 2023,
    grapeVariety: "Sauvignon Blanc",
    alcoholPercent: 13,
    price: 620000,
    stock: 52,
    shortDescription: "Tươi mới, sảng khoái, rất được ưa chuộng tại các nhà hàng.",
    description:
      "Kim Crawford là một trong những thương hiệu Sauvignon Blanc bán chạy nhất thế giới nhờ phong cách tươi mát, dễ uống và giá thành hợp lý.",
    tastingNotes: "Chanh xanh, ổi, cỏ chanh.",
    foodPairing: "Gỏi tôm, súp hải sản, cá hấp.",
    rating: 4.5,
    isNew: true,
  },
  {
    name: "Santa Margherita Pinot Grigio",
    sku: "MDW-IT-003",
    category: "vang-trang",
    country: "y",
    region: "Alto Adige",
    vintage: 2022,
    grapeVariety: "Pinot Grigio",
    alcoholPercent: 13,
    price: 780000,
    stock: 38,
    shortDescription: "Pinot Grigio thanh lịch, biểu tượng vang trắng nước Ý.",
    description:
      "Santa Margherita là thương hiệu tiên phong đưa Pinot Grigio ra thị trường quốc tế, nổi bật với sự tinh tế và cân bằng hoàn hảo.",
    tastingNotes: "Táo xanh, hoa trắng, khoáng chất thanh mát.",
    foodPairing: "Risotto hải sản, cá trắng áp chảo.",
    rating: 4.6,
  },
  {
    name: "Torres Viña Sol",
    sku: "MDW-ES-002",
    category: "vang-trang",
    country: "tay-ban-nha",
    region: "Catalunya",
    vintage: 2023,
    grapeVariety: "Parellada",
    alcoholPercent: 11.5,
    price: 310000,
    stock: 100,
    shortDescription: "Vang trắng nhẹ nhàng, giá phải chăng cho mọi bữa tiệc.",
    description:
      "Viña Sol là chai vang trắng bán chạy nhất của nhà Torres, mang hương vị tươi mát điển hình cho khí hậu Địa Trung Hải.",
    tastingNotes: "Cam, dứa, hoa cam.",
    foodPairing: "Hải sản hấp, gỏi cuốn, đồ chiên nhẹ.",
    rating: 4,
  },
  {
    name: "Miraval Côtes de Provence Rosé",
    sku: "MDW-FR-003",
    category: "vang-hong",
    country: "phap",
    region: "Provence",
    vintage: 2022,
    grapeVariety: "Grenache, Cinsault, Syrah",
    alcoholPercent: 13,
    price: 950000,
    stock: 28,
    shortDescription: "Rosé thượng hạng vùng Provence, tinh tế và sang trọng.",
    description:
      "Miraval là chai rosé danh tiếng bậc nhất Provence, mang màu hồng phấn quyến rũ cùng hương vị thanh lịch, thường xuất hiện tại các sự kiện cao cấp.",
    tastingNotes: "Dâu tây, dưa hấu, hoa hồng nhẹ, axit tươi sáng.",
    foodPairing: "Salad, sushi, các món khai vị nhẹ.",
    rating: 4.7,
    featured: true,
  },
  {
    name: "Whispering Angel Rosé",
    sku: "MDW-FR-004",
    category: "vang-hong",
    country: "phap",
    region: "Côtes de Provence",
    vintage: 2023,
    grapeVariety: "Grenache, Rolle, Cinsault",
    alcoholPercent: 13,
    price: 890000,
    stock: 33,
    shortDescription: "Rosé được yêu thích nhất tại các bữa tiệc bãi biển và resort.",
    description:
      "Whispering Angel là biểu tượng của phong cách sống hiện đại, tinh tế, thường xuyên xuất hiện tại các khu nghỉ dưỡng 5 sao trên toàn thế giới.",
    tastingNotes: "Đào trắng, dâu rừng, cam bergamot.",
    foodPairing: "Hải sản nướng, tapas, tiệc ngoài trời.",
    rating: 4.6,
    isNew: true,
  },
  {
    name: "Château d'Esclans Whispering Angel Magnum",
    sku: "MDW-FR-005",
    category: "vang-hong",
    country: "phap",
    region: "Côtes de Provence",
    vintage: 2022,
    grapeVariety: "Grenache, Cinsault, Vermentino",
    alcoholPercent: 13,
    volumeMl: 1500,
    price: 1980000,
    stock: 12,
    shortDescription: "Phiên bản Magnum 1.5L, gây ấn tượng mạnh tại các bữa tiệc lớn.",
    description:
      "Chai Magnum với dung tích gấp đôi thông thường, là lựa chọn hoàn hảo để tạo điểm nhấn tại các sự kiện, tiệc cưới sang trọng.",
    tastingNotes: "Cam quýt, dâu tây, hoa nhài.",
    foodPairing: "Buffet hải sản, tiệc đứng ngoài trời.",
    rating: 4.7,
  },
  {
    name: "Moët & Chandon Impérial Brut",
    sku: "MDW-FR-006",
    category: "vang-no",
    country: "phap",
    region: "Champagne",
    vintage: null,
    grapeVariety: "Pinot Noir, Chardonnay, Pinot Meunier",
    alcoholPercent: 12,
    price: 1450000,
    stock: 45,
    shortDescription: "Champagne biểu tượng cho mọi khoảnh khắc ăn mừng.",
    description:
      "Moët & Chandon Impérial là chai Champagne được yêu thích nhất thế giới, đại diện cho sự sang trọng và niềm vui trong từng khoảnh khắc đặc biệt.",
    tastingNotes: "Táo xanh, cam quýt, bánh mì nướng, bong bóng mịn.",
    foodPairing: "Tiệc mừng, khai vị, tráng miệng nhẹ.",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Veuve Clicquot Yellow Label Brut",
    sku: "MDW-FR-007",
    category: "vang-no",
    country: "phap",
    region: "Champagne",
    vintage: null,
    grapeVariety: "Pinot Noir, Chardonnay, Pinot Meunier",
    alcoholPercent: 12,
    price: 1590000,
    stock: 38,
    shortDescription: "Nhãn vàng huyền thoại, đậm đà cá tính hơn 250 năm lịch sử.",
    description:
      "Veuve Clicquot Yellow Label là một trong những chai Champagne được nhận diện nhiều nhất thế giới với hương vị đậm đà, cấu trúc chắc chắn.",
    tastingNotes: "Bánh mì nướng, mật ong, trái cây vàng, bong bóng dồi dào.",
    foodPairing: "Hàu, sushi, tiệc chúc mừng.",
    awards: "Huy chương Vàng - International Wine Challenge",
    rating: 4.8,
    featured: true,
  },
  {
    name: "Chandon Brut Réserve",
    sku: "MDW-AR-002",
    category: "vang-no",
    country: "argentina",
    region: "Mendoza",
    vintage: null,
    grapeVariety: "Chardonnay, Pinot Noir, Semillon",
    alcoholPercent: 12.5,
    price: 620000,
    stock: 60,
    shortDescription: "Vang nổ phong cách Champagne, giá thành hợp lý.",
    description:
      "Được sản xuất theo phương pháp truyền thống Méthode Champenoise tại Mendoza, Chandon Brut mang đến trải nghiệm bong bóng cao cấp với chi phí phải chăng.",
    tastingNotes: "Táo, lê, bánh mì nướng nhẹ.",
    foodPairing: "Tiệc khai trương, tiệc sinh nhật, khai vị.",
    rating: 4.3,
  },
  {
    name: "Freixenet Cordon Negro Brut",
    sku: "MDW-ES-003",
    category: "vang-no",
    country: "tay-ban-nha",
    region: "Catalunya",
    vintage: null,
    grapeVariety: "Macabeo, Xarel-lo, Parellada",
    alcoholPercent: 11.5,
    price: 380000,
    stock: 75,
    shortDescription: "Cava nổi tiếng với chai đen đặc trưng, phổ biến toàn cầu.",
    description:
      "Freixenet Cordon Negro là loại Cava bán chạy nhất thế giới, dễ nhận diện với chai màu đen bóng đặc trưng.",
    tastingNotes: "Táo xanh, cam quýt, bong bóng mịn màng.",
    foodPairing: "Tiệc ngoài trời, khai vị nhẹ, trái cây.",
    rating: 4.2,
  },
  {
    name: "Nederburg Winemaster's Reserve Pinotage",
    sku: "MDW-ZA-001",
    category: "vang-do",
    country: "nam-phi",
    region: "Western Cape",
    vintage: 2020,
    grapeVariety: "Pinotage",
    alcoholPercent: 14,
    price: 460000,
    stock: 44,
    shortDescription: "Pinotage đặc trưng Nam Phi, hương vị độc đáo khó quên.",
    description:
      "Pinotage là giống nho lai đặc trưng của Nam Phi, mang đến chai vang có cá tính riêng biệt, đậm đà và giàu năng lượng.",
    tastingNotes: "Mận chín, khói nhẹ, gia vị đen.",
    foodPairing: "Thịt nướng kiểu Nam Phi (Braai), sườn heo sốt BBQ.",
    rating: 4.3,
    isNew: true,
  },
  {
    name: "Hardys Stamp of Australia Shiraz Cabernet",
    sku: "MDW-AU-005",
    category: "vang-do",
    country: "uc",
    region: "South Eastern Australia",
    vintage: 2022,
    grapeVariety: "Shiraz, Cabernet Sauvignon",
    alcoholPercent: 13.5,
    price: 340000,
    stock: 95,
    shortDescription: "Vang Úc quen thuộc, mềm mại, phù hợp cho nhiều dịp.",
    description:
      "Một trong những lựa chọn vang nhập khẩu phổ biến nhất tại các nhà hàng Việt Nam nhờ mức giá dễ tiếp cận và hương vị hài hòa.",
    tastingNotes: "Mâm xôi, mận, tiêu đen nhẹ.",
    foodPairing: "Món Việt đậm đà, lẩu, đồ nướng.",
    rating: 4.1,
  },
  {
    name: "Robert Mondavi Private Selection Merlot",
    sku: "MDW-US-002",
    category: "vang-do",
    country: "my",
    region: "California",
    vintage: 2021,
    grapeVariety: "Merlot",
    alcoholPercent: 13.5,
    price: 540000,
    stock: 50,
    shortDescription: "Merlot mềm mại, dễ uống, phong cách California ấm áp.",
    description:
      "Robert Mondavi Private Selection mang lại trải nghiệm vang California đích thực với chất lượng ổn định, phù hợp cho những bữa tối ấm cúng.",
    tastingNotes: "Anh đào đen, vani, socola sữa.",
    foodPairing: "Mì Ý sốt kem, gà tây nướng, phô mai mềm.",
    rating: 4.3,
  },
];

const newsPosts = [
  {
    slug: "cach-chon-ruou-vang-cho-tiec-cuoi",
    title: "Cách chọn rượu vang cho tiệc cưới sang trọng",
    excerpt:
      "Lựa chọn vang phù hợp là yếu tố quan trọng giúp bữa tiệc cưới thêm phần trang trọng và đáng nhớ.",
    content:
      "Khi lựa chọn rượu vang cho tiệc cưới, cần cân nhắc đến thực đơn, số lượng khách mời và ngân sách. MDWines gợi ý nên chuẩn bị ít nhất hai loại vang: một vang trắng tươi mát cho phần khai vị hải sản, và một vang đỏ đậm đà cho món chính. Đừng quên một loại vang nổ hoặc Champagne cho nghi thức khai tiệc và lời chúc mừng...",
    coverTone: "burgundy",
    author: "MDWines Team",
  },
  {
    slug: "5-vung-trong-nho-noi-tieng-the-gioi",
    title: "5 vùng trồng nho nổi tiếng thế giới mà tín đồ rượu vang nên biết",
    excerpt: "Từ Bordeaux đến Mendoza, mỗi vùng đất mang đến một câu chuyện hương vị riêng biệt.",
    content:
      "Bordeaux (Pháp), Tuscany (Ý), Napa Valley (Mỹ), Mendoza (Argentina) và Barossa Valley (Úc) là năm vùng trồng nho có ảnh hưởng lớn nhất đến ngành công nghiệp rượu vang toàn cầu. Mỗi vùng sở hữu điều kiện thổ nhưỡng và khí hậu riêng, tạo nên những phong cách vang đặc trưng không thể nhầm lẫn...",
    coverTone: "gold",
    author: "MDWines Team",
  },
  {
    slug: "nghe-thuat-khai-vang-va-rot-vang-dung-cach",
    title: "Nghệ thuật khai vang và rót vang đúng cách",
    excerpt: "Những kỹ thuật cơ bản giúp bạn thưởng thức trọn vẹn hương vị của từng chai vang.",
    content:
      "Nhiệt độ phục vụ, thời gian 'thở' của rượu (decanting) và cách rót vang đều ảnh hưởng trực tiếp đến trải nghiệm thưởng thức. Vang đỏ nên được phục vụ ở 16-18°C, trong khi vang trắng và vang nổ nên ướp lạnh ở 8-10°C...",
    coverTone: "emerald",
    author: "MDWines Team",
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();
  await prisma.newsPost.deleteMany();
  await prisma.adminUser.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    categoryMap.set(c.slug, created.id);
  }

  const countryMap = new Map<string, string>();
  for (const c of countries) {
    const created = await prisma.country.create({ data: c });
    countryMap.set(c.slug, created.id);
  }

  for (const p of products) {
    const slug = p.sku.toLowerCase();
    await prisma.product.create({
      data: {
        slug,
        sku: p.sku,
        name: p.name,
        categoryId: categoryMap.get(p.category)!,
        countryId: countryMap.get(p.country)!,
        region: p.region,
        vintage: p.vintage ?? null,
        grapeVariety: p.grapeVariety,
        alcoholPercent: p.alcoholPercent,
        volumeMl: p.volumeMl ?? 750,
        price: p.price,
        salePrice: p.salePrice ?? null,
        stock: p.stock,
        shortDescription: p.shortDescription,
        description: p.description,
        tastingNotes: p.tastingNotes,
        foodPairing: p.foodPairing,
        awards: p.awards ?? null,
        images: JSON.stringify([]),
        rating: p.rating,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
      },
    });
  }

  for (const post of newsPosts) {
    await prisma.newsPost.create({ data: post });
  }

  const passwordHash = await bcrypt.hash("MDWines@2026", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@mdwines.vn",
      passwordHash,
      name: "Quản trị viên MDWines",
    },
  });

  console.log(`Seeded ${categories.length} categories, ${countries.length} countries, ${products.length} products.`);
  console.log("Admin login: admin@mdwines.vn / MDWines@2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
