import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Page.css";
import bg from "../assets/bg-2.png";

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <img src={bg} alt="background" className="bg-img" />
            <h1 class="title-page">ABOUT US</h1>
            <div class="content-card">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu magna elementum, bibendum lectus in, commodo velit. Curabitur et porta lectus, maximus ullamcorper sapien. In condimentum leo et sapien interdum, eu porttitor dui bibendum. Curabitur porta quis lacus id condimentum. Nam eu massa eu purus elementum semper id et quam. Donec a viverra nisi, non vulputate nisi. Proin venenatis ac libero ut volutpat.
                <br /><br />
                Aliquam iaculis fermentum viverra. Pellentesque pulvinar mauris sed nisl sagittis feugiat. Morbi vel tincidunt est, ut bibendum nulla. Duis sollicitudin ligula non mauris tincidunt, ut aliquam turpis congue. Vestibulum et mauris velit. Sed porta iaculis lacus vitae rutrum. Curabitur libero leo, ornare ut eleifend vitae, bibendum vel dolor. Phasellus consectetur, justo et fermentum aliquam, ex felis maximus nibh, et tempus eros tortor non mi.
                <br /><br />
                Ut id massa euismod, aliquam erat non, scelerisque sem. Suspendisse faucibus congue nisi non viverra. Ut aliquet ligula sed tellus gravida lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat tempus leo sed suscipit. Nunc condimentum at tellus in pharetra. Vestibulum ut urna a odio commodo ornare.
                <br /><br />
                Nullam tristique vulputate metus sed egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus vitae velit at turpis maximus congue. Fusce a lacus convallis, porta quam eget, ornare velit. Integer et augue ante. Sed accumsan mollis risus, condimentum dictum leo tincidunt non. Donec malesuada, dui vel pellentesque congue, elit est porta neque, a volutpat justo lorem commodo turpis. Maecenas malesuada erat accumsan eros efficitur fringilla. Fusce sed congue lacus. Phasellus vitae mattis justo. Pellentesque ornare velit vitae erat accumsan pretium. Nulla non auctor diam, vitae convallis libero. Fusce vehicula, ipsum eu posuere interdum, felis lorem finibus sem, ac luctus massa velit at nulla. Curabitur id sapien placerat tellus condimentum fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                <br /><br />
                Nam interdum dolor libero, vitae imperdiet arcu auctor sit amet. Proin tristique bibendum est, quis ultricies mi fermentum eu. Ut malesuada non odio a commodo. Nam lobortis condimentum suscipit. Aenean viverra laoreet quam vel consequat. Vestibulum diam libero, fermentum eget facilisis vitae, accumsan ac tortor. Nam egestas nisl a ante ullamcorper dapibus non porttitor eros. Cras mollis accumsan turpis nec porttitor. Pellentesque quis volutpat ipsum. Duis nec ultricies elit.
            </div>
        </>
    );
};

export default AboutUs;
