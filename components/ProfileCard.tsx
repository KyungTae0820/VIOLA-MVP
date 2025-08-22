'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge, Button, Card } from "@/components/ui";
import { Edit, Phone, Mail, ChevronRight } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { UserProfile } from "@/types/profile";

const BUCKET = 'profileimages';

async function getLatestSignedUrl(userId: string) {
  // 1) 해당 유저 폴더에서 최신 파일
  const { data: files, error } = await supabase
    .storage
    .from(BUCKET)
    .list(userId, { limit: 1, sortBy: { column: 'updated_at', order: 'desc' } });

  if (error || !files?.length) return undefined;

  const path = `${userId}/${files[0].name}`;

  // 2) 사인드 URL(24h) 우선
  const { data: signed, error: signErr } = await supabase
    .storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24);

  if (!signErr && signed?.signedUrl) {
    // 캐시 무효화 쿼리
    return `${signed.signedUrl}${signed.signedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }

  // 3) public 버킷일 경우 폴백
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  return publicUrl ? `${publicUrl}?v=${Date.now()}` : undefined;
}

const ProfileCard = ({
  id,                 // ✅ Clerk userId (폴더명으로 사용)
  firstname,
  lastname,
  username,
  bio,
  phone,
  email,
  tags,
  instagramUrl,
  twitterUrl,
  linkedinUrl,
  image,              // 부모가 이미 URL을 넘기면 우선 사용
}: UserProfile) => {
  const fullName = `${firstname} ${lastname}`;
  const fallbackChar = firstname?.charAt(0) ?? "U";

  // 부모가 준 image 우선, 없으면 스토리지에서 로딩
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(image ?? undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (image) return;   // 이미 부모가 제공하면 그대로 사용
      if (!id) return;     // id 없으면 스킵

      const url = await getLatestSignedUrl(id);
      if (alive) setAvatarUrl(url ?? '/assets/defaultimg.jpg');
    })();
    return () => {
      alive = false;
    };
  }, [id, image]);

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
          <AvatarImage
            src={avatarUrl || "/assets/defaultimg.jpg"}
            alt={fullName}
            className="object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/defaultimg.jpg"; }}
          />
          <AvatarFallback className="text-4xl">{fallbackChar}</AvatarFallback>
        </Avatar>
      </div>

      {/* Middle Column - Profile Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              {tags?.[0] && <Badge variant={tags[0].variant}>{tags[0].label}</Badge>}
              {username && <p className="text-profile-text-muted text-sm">@{username}</p>}
            </div>
          </div>
          {bio && <p className="text-sm text-foreground mt-2">{bio}</p>}
        </div>

        {/* Team */}
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

        {/* Tags */}
        <Card className="p-4 space-y-2">
          <h3 className="font-medium text-foreground mb-3">Tags</h3>
        </Card>
      </div>

      {/* Right Column - Contact & Actions */}
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="profile" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="flex space-x-3 mb-2">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaInstagram className="text-xl text-black" />
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaTwitter className="text-xl text-black" />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaLinkedin className="text-xl text-black" />
            </a>
          )}
        </div>

        <div className="space-y-4">
          {phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-profile-text-muted" />
              <span className="text-foreground">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-profile-text-muted" />
              <span className="text-foreground">{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
