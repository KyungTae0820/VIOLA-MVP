import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge, Button, Card } from "@/components/ui";
import { Edit, Phone, Mail, ChevronRight } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

interface ProfileCardProps {
    name: string;
    username: string;
    bio?: string;
    phone?: string;
    email?: string;
    tags?: Array<{ label: string; variant: 'viola' | 'ar' | 'artist' }>
    instagramUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
}

const ProfileCard = ({ name, username, bio, phone, email, tags, instagramUrl, twitterUrl, linkedinUrl }: ProfileCardProps) => {
    const teamMembers = [
        { id: 1, image: "/assets/defaultimg.jpg", name: "Team Member 1" },
        { id: 2, image: "/assets/defaultimg.jpg", name: "Team Member 2" },
        { id: 3, image: "/assets/defaultimg.jpg", name: "Team Member 3" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Section Title */}
            <div className="col-span-full">
                <div className="flex items-center justify-between bg-profile-card px-4 py-2 rounded-lg">
                    <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
                </div>
            </div>
            {/* Left Column - Profile Image */}
            <div className="flex justify-center lg:justify-start">
                <Avatar className="h-64 w-64">
                    <AvatarImage src="/assets/ryan.jpg" alt={name} className="object-cover" />
                    <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>

            {/* Middle Column - Profile Info */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-foreground">{name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {tags?.[0] && (
                                <Badge variant={tags[0].variant}>{tags[0].label}</Badge>
                            )}
                            <p className="text-profile-text-muted text-sm">@{username}</p>
                        </div>
                    </div>
                    <p className="text-sm text-foreground mt-2">{bio}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Key Team Contacts</span>
                        <ChevronRight className="h-4 w-4 text-profile-text-muted" />
                    </div>
                    <div className="flex gap-2">
                        {teamMembers.map((member) => (
                            <Avatar key={member.id} className="h-12 w-12 border-2 border-background">
                                <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>

                <Card className="p-4 space-y-2">
                    <h3 className="font-medium text-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag, index) => (
                            <Badge key={index} variant={tag.variant}>
                                {tag.label}
                            </Badge>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right Column - Contact & Actions */}
            <div className="space-y-6">

                {/* Edit Button */}
                <div className="flex justify-end">
                    <Button variant="profile" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-3 mb-2">
                    {instagramUrl && (
                        <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                        >
                            <FaInstagram className="text-xl text-black" />
                        </a>
                    )}
                    {twitterUrl && (
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                        >
                            <FaTwitter className="text-xl text-black" />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition"
                        >
                            <FaLinkedin className="text-xl text-black" />
                        </a>
                    )}
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-profile-text-muted" />
                        <span className="text-foreground">{phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-profile-text-muted" />
                        <span className="text-foreground">{email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;