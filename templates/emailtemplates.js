 const categoryEmail = (name) => {
    return `<h3>Dear Sir, </h3>
    <br>
    <img src="https://images.vexels.com/media/users/3/144131/isolated/preview/29576a7e0442960346703d3ecd6bac04-picture-doodle-icon.png" alt="img" height="50" width="50"/>
    <br> <br> <br>
    <b>New ${name} Category is created </b>
    <br> <br> <br>
    <address>
        Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br>
        Visit us at:<br>
        Example.com<br>
        Box 564, Disneyland<br>
        USA
    </address>`;
}

module.exports={categoryEmail}