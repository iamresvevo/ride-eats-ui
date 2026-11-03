# Migrating to 0.9

Steps, ScrollArea and Separator have been removed. They added a generic wizard rail or renamed ordinary markup without enough reusable behavior. Use your application’s actual workflow navigation, a styled overflow container, or semantic `<hr />` as appropriate. No replacement wizard is introduced.

Menus now use the browser top layer to escape clipped tables while keeping inherited theme tokens and closing transitions. Select forwards standard button props, including field IDs and accessible descriptions.

The design foundation lives in `css/tokens.css`. Override tokens at the application root; avoid page-specific component recoloring. The command-menu preview demonstrates local draft creation, filtering, nested appearance commands and recoverable execution errors.

In 0.9.14, ScrollArea returns with substantive panel behavior: independently bounded native scrolling, persistent header/footer slots, accessible region naming and Workbench integration. The previous simple overflow wrapper remains retired.
